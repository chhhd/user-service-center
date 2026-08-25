import { useEffect, useMemo } from "react";
import StepHeader from "../shared/StepHeader";
import ResultTypeCard from "../step4/ResultTypeCard";
import PolicyList from "../step4/PolicyList";
import ChangeSummary from "../step7/ChangeSummary";
import { useJourney } from "../shared/journeyStore";
import { getGoalById } from "../data/financialGoals";

const FEEDBACK_LABEL = {
  similar: "꽤 비슷해요",
  partly: "일부만 맞아요",
  different: "거의 다르다고 느껴요",
};

// STEP8: STEP7까지의 최종 상태(추천/위험도/전후 비교)를 한 화면에 정리해서 보여준다.
// 새로 계산하지 않고 journey 전역 상태를 그대로 읽기만 하며, 화면에 표시한 요약을
// journey.result에 저장해 STEP9(부스 마무리)에서도 참조할 수 있게 한다.
export default function Step8Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { profile, goal, recommendation, privacy_risk, usage_report, comparison, inference_feedback, edited } =
    journey;
  const goalInfo = getGoalById(goal);

  const result = useMemo(
    () => ({
      profile_id: profile?.id ?? null,
      goal,
      edited,
      recommendation_type: recommendation.type,
      policies: recommendation.policies.map((p) => p.policy),
      consented_count: usage_report.consented_count,
      privacy_risk,
      comparison,
      inference_feedback,
    }),
    [profile, goal, edited, recommendation, usage_report, privacy_risk, comparison, inference_feedback]
  );

  useEffect(() => {
    actions.completeStep8(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="screen">
      <StepHeader step={8} total={9} title="최종 결과표" />

      {profile && (
        <p className="context-line">
          선택한 프로필 <strong>{profile.avatar} {profile.name}</strong> · 목표{" "}
          <strong>{goalInfo?.label}</strong>
        </p>
      )}

      <p className="screen-desc">
        {edited
          ? "STEP7에서 동의 내역을 다시 선택한 결과를 최종 정리했어요."
          : "STEP7에서 동의 내용을 바꾸지 않았어요. STEP6과 같은 결과로 마무리돼요."}
      </p>

      <ResultTypeCard type={recommendation.type} messages={recommendation.messages} />
      <PolicyList policies={recommendation.policies} />

      <section className="risk-panel">
        <div className="risk-panel-head">
          <span className="risk-panel-label">최종 개인정보 위험도</span>
          <span className={`risk-panel-score risk-panel-score--${privacy_risk.level}`}>
            {privacy_risk.score}점 · {privacy_risk.level}
          </span>
        </div>
        <p className="hint-text hint-text--muted">
          총 {usage_report.consented_count}개 정보 중 {usage_report.recommendation_used_count}개가 추천에,{" "}
          {usage_report.inference_evidence_field_count}개가 추가 추론에 활용될 수 있어요.
        </p>
      </section>

      <ChangeSummary comparison={comparison} />

      {inference_feedback && (
        <p className="hint-text">
          STEP5에서 남긴 추론 정확도 응답 ·{" "}
          <strong>{FEEDBACK_LABEL[inference_feedback] ?? inference_feedback}</strong>
        </p>
      )}

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
