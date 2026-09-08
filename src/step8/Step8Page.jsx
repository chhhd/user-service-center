import { useEffect, useMemo } from "react";
import StepHeader from "../shared/StepHeader";
import QuadrantChart from "../result/QuadrantChart";
import ResultTypeCard from "../result/ResultTypeCard";
import { calculateRecommendationUtility } from "../result/utilityScore";
import { classifyResultType } from "../result/resultTypeRules";
import { useJourney } from "../shared/journeyStore";
import { getGoalById } from "../data/financialGoals";

const FEEDBACK_LABEL = {
  similar: "꽤 비슷해요",
  partly: "일부만 맞아요",
  different: "거의 다르다고 느껴요",
};

// STEP8: 개발 파이프라인 문서 기준 최종 결과표.
// - 수정 전(before_snapshot) / 수정 후(현재 journey) 각각의 추천 활용도를 calculateRecommendationUtility로
//   다시 계산한다 (STEP4~6과 같은 로직을 새로 만들지 않고 재사용).
// - 위험도 x 활용도 사분면으로 최종 유형을 판정한다 (resultTypeRules).
// - 화면에는 사분면 그래프(전후 화살표)와 위험도·활용도 각각의 점수 근거 목록을 보여준다.
// - 이 화면에서 계산한 요약을 journey.result에 저장해 STEP9(부스 마무리)에서도 재사용한다.
export default function Step8Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const {
    profile,
    goal,
    consent,
    data_controls,
    recommendation,
    type_rule,
    privacy_risk,
    usage_report,
    comparison,
    inference_feedback,
    edited,
    before_snapshot,
  } = journey;
  const goalInfo = getGoalById(goal);

  const beforeUtility = useMemo(
    () =>
      calculateRecommendationUtility({
        consent: before_snapshot.consent,
        goal,
        recommendation: before_snapshot.recommendation_signature,
        typeRule: before_snapshot.type_rule,
      }),
    [before_snapshot, goal]
  );

  const afterUtility = useMemo(
    () => calculateRecommendationUtility({ consent, goal, recommendation, typeRule: type_rule }),
    [consent, goal, recommendation, type_rule]
  );

  const finalResultType = useMemo(
    () =>
      classifyResultType({
        utility_score: afterUtility.score,
        risk_score: privacy_risk.score,
        risk_level: privacy_risk.level,
        data_controls,
      }),
    [afterUtility, privacy_risk, data_controls]
  );

  const result = useMemo(
    () => ({
      profile_id: profile?.id ?? null,
      goal,
      edited,
      recommendation_type: recommendation.type,
      policies: recommendation.policies.map((p) => p.policy),
      consented_count: usage_report.consented_count,
      privacy_risk,
      utility_score: afterUtility.score,
      result_type: finalResultType.id,
      result_type_label: finalResultType.type,
      result_type_message: finalResultType.message,
      result_type_practice_tip: finalResultType.practice_tip,
      result_type_sticker_color: finalResultType.sticker_color,
      comparison,
      inference_feedback,
    }),
    [
      profile,
      goal,
      edited,
      recommendation,
      usage_report,
      privacy_risk,
      afterUtility,
      finalResultType,
      comparison,
      inference_feedback,
    ]
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
          ? "STEP7에서 다시 선택한 동의 내역을 기준으로 최종 위치를 정리했어요."
          : "STEP7에서 동의 내용을 바꾸지 않았어요. STEP6과 같은 결과로 마무리돼요."}
      </p>

      <ResultTypeCard resultType={finalResultType} />

      <QuadrantChart
        before={{ utility_score: beforeUtility.score, risk_score: before_snapshot.privacy_risk.score }}
        after={{ utility_score: afterUtility.score, risk_score: privacy_risk.score }}
      />
      <p className="hint-text hint-text--muted">
        참가자를 평가하는 점수가 아니라, 지금까지의 선택 상태를 설명하는 값이에요.
      </p>

      <section className="utility-panel">
        <div className="risk-panel-head">
          <span className="risk-panel-label">추천 활용도</span>
          <span className="risk-panel-score">{afterUtility.score}점</span>
        </div>
        <ul className="risk-reason-list">
          {afterUtility.reasons.map((reason) => (
            <li key={reason.id} className="risk-reason">
              <span className="risk-delta">
                {reason.score}/{reason.max}
              </span>
              <span className="risk-reason-label">{reason.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="risk-panel">
        <div className="risk-panel-head">
          <span className="risk-panel-label">개인정보 위험도</span>
          <span className={`risk-panel-score risk-panel-score--${privacy_risk.level}`}>
            {privacy_risk.score}점 · {privacy_risk.level}
          </span>
        </div>
        <ul className="risk-reason-list">
          {privacy_risk.reasons.map((reason) => (
            <li key={reason.id} className="risk-reason">
              <span className={`risk-delta${reason.delta >= 0 ? " risk-delta--up" : " risk-delta--down"}`}>
                {reason.delta >= 0 ? `+${reason.delta}` : reason.delta}
              </span>
              <span className="risk-reason-label">{reason.label}</span>
            </li>
          ))}
        </ul>
      </section>

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
