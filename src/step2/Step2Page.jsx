import ConsentModeSelect from "./ConsentModeSelect";
import FieldConsentGroup from "./FieldConsentGroup";
import DataControlsPanel from "./DataControlsPanel";
import StepHeader from "../shared/StepHeader";
import { useJourney } from "../shared/journeyStore";
import { getConsentedFieldIds } from "../shared/consentRules";
import { FIELD_CATEGORY } from "../shared/dataFieldMeta";
import { getGoalById } from "../data/financialGoals";

export default function Step2Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { profile, goal, consent_mode, consent, data_controls } = journey;
  const goalInfo = getGoalById(goal);
  const consentedFieldIds = getConsentedFieldIds(consent);

  const canProceed = consent_mode != null && data_controls.retention_period != null;

  return (
    <div className="screen">
      <StepHeader step={2} total={7} title="개인정보 제공 범위를 선택해 주세요" />

      {profile && (
        <p className="context-line">
          선택한 프로필 <strong>{profile.avatar} {profile.name}</strong> · 목표{" "}
          <strong>{goalInfo?.label}</strong>
        </p>
      )}

      <p className="screen-desc">
        각 항목의 수집 목적과 필요성을 확인하고, 전체 동의 / 맞춤 동의 / 최소 동의 중 하나를 선택해요.
        동의하지 않은 항목은 프로필에 값이 있어도 이후 추천·추론에 사용되지 않아요.
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

      <div className="screen-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button type="button" className="btn btn-primary" disabled={!canProceed} onClick={onNext}>
          다음
        </button>
      </div>
    </div>
  );
}
