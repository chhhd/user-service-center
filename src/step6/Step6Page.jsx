import { useEffect, useMemo } from "react";
import StepHeader from "../shared/StepHeader";
import UsageSummary from "./UsageSummary";
import DataFlowGraph from "./DataFlowGraph";
import { buildUsageReport } from "./buildUsageReport";
import { calculatePrivacyRisk } from "./riskScore";
import { useJourney } from "../shared/journeyStore";

// STEP6: 동의한 정보가 금융 추천과 추가 추론에 각각 얼마나 쓰였는지 비교하는 리포트.
// 활용 리포트와 위험도를 계산해 저장하고, STEP7 전후 비교의 기준이 될 before_snapshot을
// 이 시점에 1회 생성한다 (completeStep6에서 이미 존재하면 덮어쓰지 않는다).
export default function Step6Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { consent, data_controls, recommendation, inference } = journey;

  const usageReport = useMemo(
    () => buildUsageReport({ consent, data_controls, recommendation, inference }),
    [consent, data_controls, recommendation, inference]
  );

  const privacyRisk = useMemo(
    () => calculatePrivacyRisk({ consent, data_controls }),
    [consent, data_controls]
  );

  useEffect(() => {
    actions.completeStep6(usageReport, privacyRisk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageReport, privacyRisk]);

  const inferenceExceedsRecommendation =
    usageReport.inference_evidence_field_count > usageReport.recommendation_used_count;

  return (
    <div className="screen">
      <StepHeader step={6} total={7} title="데이터 활용 리포트" />

      <p className="screen-desc">
        당신은 총 <strong>{usageReport.consented_count}개</strong>의 정보 제공에 동의했어요. 각 정보가 실제로
        어디에 쓰였는지 확인해 보세요.
      </p>

      <UsageSummary report={usageReport} />

      <DataFlowGraph report={usageReport} />

      <div className="contrast-banner">
        {inferenceExceedsRecommendation ? (
          <p>
            추천에는 <strong>{usageReport.recommendation_used_count}개</strong>의 정보가 사용되었지만, 당신을
            설명하는 추론에는 <strong>{usageReport.inference_evidence_field_count}개</strong>의 정보가 활용될
            수 있어요.
          </p>
        ) : (
          <p>
            현재 선택에서는 추천에 사용된 정보와 추가 추론에 활용될 수 있는 정보의 범위가 비슷해요. 그래도
            제3자 제공 여부와 보관 기간을 함께 확인해 보세요.
          </p>
        )}
      </div>

      <section className="risk-panel">
        <div className="risk-panel-head">
          <span className="risk-panel-label">현재 개인정보 위험도</span>
          <span className={`risk-panel-score risk-panel-score--${privacyRisk.level}`}>
            {privacyRisk.score}점 · {privacyRisk.level}
          </span>
        </div>
        <ul className="risk-reason-list">
          {privacyRisk.reasons.map((reason) => (
            <li key={reason.id} className="risk-reason">
              <span className={`risk-delta${reason.delta >= 0 ? " risk-delta--up" : " risk-delta--down"}`}>
                {reason.delta >= 0 ? `+${reason.delta}` : reason.delta}
              </span>
              <span className="risk-reason-label">{reason.label}</span>
            </li>
          ))}
        </ul>
        <p className="hint-text hint-text--muted">
          위험도는 참가자를 평가하는 점수가 아니라 지금의 선택 상태를 설명하는 값이에요.
        </p>
      </section>

      <div className="screen-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          다음
        </button>
      </div>
    </div>
  );
}
