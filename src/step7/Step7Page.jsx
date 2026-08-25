import { useMemo, useState } from "react";
import StepHeader from "../shared/StepHeader";
import ConsentModeSelect from "../step2/ConsentModeSelect";
import FieldConsentGroup from "../step2/FieldConsentGroup";
import DataControlsPanel from "../step2/DataControlsPanel";
import QuestionList from "../step3/QuestionList";
import ChangeSummary from "./ChangeSummary";
import { buildRecalcAnswers, getEditableInputFieldIds, hasChangedFromSnapshot } from "./recalculate";
import { compareSnapshots } from "./compareSnapshots";
import { useJourney } from "../shared/journeyStore";
import { getConsentedFieldIds } from "../shared/consentRules";
import { FIELD_CATEGORY } from "../shared/dataFieldMeta";
import { recommend } from "../step4/recommend";
import { buildInferenceContext } from "../step5/buildInferenceContext";
import { buildInference } from "../step5/evaluateInferences";
import { buildUsageReport } from "../step6/buildUsageReport";
import { calculatePrivacyRisk } from "../step6/riskScore";

// STEP7 처리 순서:
// 1) STEP2와 동일한 동의 UI로 consent/data_controls를 다시 선택한다 (journey 전역 상태를 그 자리에서 갱신).
// 2) 새로 동의한 INPUT 항목이 있으면 이 화면에서 바로 답하게 한다 (STEP3 질문 컴포넌트 재사용).
// 3) 답이 모두 채워지면 recommend/inference/usageReport/privacyRisk를 STEP4~6과 동일한 순수 함수로 다시 계산하고,
//    STEP6의 before_snapshot과 비교해 변경 요약을 실시간으로 보여준다.
// 4) "다음"을 누르는 시점에만 재계산 결과를 journey 전역 상태에 커밋한다 (completeStep7).
export default function Step7Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { profile, consent, consent_mode, data_controls, answers: savedAnswers, before_snapshot } = journey;

  const consentedFieldIds = getConsentedFieldIds(consent);
  const inputFieldIds = getEditableInputFieldIds(consent);

  // 이전 답변을 이어받아 초기화한다. 이번 화면에서 새로 동의한 항목은 여기서 처음 답하면 된다.
  const [selections, setSelections] = useState(() => {
    const init = {};
    Object.keys(savedAnswers).forEach((id) => {
      if (savedAnswers[id] != null) init[id] = savedAnswers[id];
    });
    return init;
  });

  function handleSelect(fieldId, value) {
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
  }

  const isAnswerComplete = inputFieldIds.every((id) => selections[id] != null);
  const canProceed = consent_mode != null && data_controls.retention_period != null && isAnswerComplete;

  const recalculated = useMemo(() => {
    if (!canProceed) return null;

    const answers = buildRecalcAnswers({ consent, profile, previousAnswers: savedAnswers, selections });
    const { recommendation, type_rule } = recommend({ answers });
    const inference = buildInference(buildInferenceContext({ profile, consent, answers }));
    const usage_report = buildUsageReport({ consent, data_controls, recommendation, inference });
    const privacy_risk = calculatePrivacyRisk({ consent, data_controls });
    const comparison = compareSnapshots({
      before_snapshot,
      after: { consent, recommendation, type_rule, usage_report, privacy_risk },
    });
    const edited = hasChangedFromSnapshot({ before_snapshot, consent, data_controls });

    return { answers, recommendation, type_rule, inference, usage_report, privacy_risk, comparison, edited };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canProceed, consent, data_controls, selections]);

  function handleNext() {
    if (!recalculated) return;
    actions.completeStep7(recalculated);
    onNext();
  }

  return (
    <div className="screen">
      <StepHeader step={7} total={9} title="동의 내역을 다시 선택해 주세요" />

      <p className="screen-desc">
        STEP6에서 확인한 활용 리포트를 참고해서 동의 범위를 자유롭게 바꿔볼 수 있어요. 바꾼 내용은 금융
        추천·추론·위험도 계산에 그대로 다시 반영돼요.
      </p>

      <ConsentModeSelect mode={consent_mode} onSelect={actions.setConsentMode} />

      <div className="field-groups">
        <FieldConsentGroup
          category={FIELD_CATEGORY.BASIC}
          consent={consent}
          onToggle={actions.toggleFieldConsent}
        />
        <FieldConsentGroup
          category={FIELD_CATEGORY.FINANCIAL}
          consent={consent}
          onToggle={actions.toggleFieldConsent}
        />
        <FieldConsentGroup
          category={FIELD_CATEGORY.SENSITIVE}
          consent={consent}
          onToggle={actions.toggleFieldConsent}
        />
      </div>

      <DataControlsPanel
        consentedFieldIds={consentedFieldIds}
        dataControls={data_controls}
        onSetThirdPartyOption={actions.setThirdPartyOption}
        onToggleThirdPartyField={actions.toggleThirdPartyField}
        onSetRetentionPeriod={actions.setRetentionPeriod}
      />

      <QuestionList fieldIds={inputFieldIds} answers={selections} onSelect={handleSelect} />

      {recalculated ? (
        <ChangeSummary comparison={recalculated.comparison} />
      ) : (
        <p className="hint-text hint-text--muted">
          동의 방식과 보관 기간을 정하고, 새로 동의한 항목에 모두 답하면 바뀐 결과를 볼 수 있어요.
        </p>
      )}

      <div className="screen-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button type="button" className="btn btn-primary" disabled={!canProceed} onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
}
