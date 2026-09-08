// STEP8 추천 활용도(Utility) 계산.
// 개발 파이프라인 문서 기준 4개 요소로 구성한다.
// - 기본 필요 정보(REQUIRED) 충족도: 최대 40점
// - 목표와 관련된 조건부 정보(CONDITIONAL, related_goals에 현재 목표 포함) 충족도: 최대 20점
// - 매칭된 정책 수: 최대 30점
// - 유형 판단 근거(type_rule.used_fields) 존재 여부: 10점
// OPTIONAL(고위험·과도) 필드는 이 네 요소 어디에도 들어가지 않으므로, 불필요한 정보를 더 준다고
// 활용도 점수가 올라가지 않는다.

import { DATA_FIELD_META, NECESSITY, ALL_FIELD_IDS } from "../shared/dataFieldMeta";

const REQUIRED_FIELD_IDS = ALL_FIELD_IDS.filter(
  (id) => DATA_FIELD_META[id].necessity === NECESSITY.REQUIRED
);

// 정책 매칭 점수의 만점 기준 개수. POLICY_RULES 특성상 답변 조합 하나로 3~4개 이상 동시에
// 매칭되는 경우가 실질적인 상한이라 4개를 만점 기준으로 둔다 (그 이상은 30점으로 고정).
const POLICY_COUNT_FOR_FULL_SCORE = 4;

function getGoalConditionalFieldIds(goal) {
  return ALL_FIELD_IDS.filter((id) => {
    const meta = DATA_FIELD_META[id];
    return (
      meta.necessity === NECESSITY.CONDITIONAL &&
      Array.isArray(meta.related_goals) &&
      goal != null &&
      meta.related_goals.includes(goal)
    );
  });
}

/** { consent, goal, recommendation, typeRule } -> { score, reasons } */
export function calculateRecommendationUtility({ consent, goal, recommendation, typeRule }) {
  const reasons = [];

  const requiredConsentedCount = REQUIRED_FIELD_IDS.filter((id) => consent?.[id] === true).length;
  const basicScore =
    REQUIRED_FIELD_IDS.length === 0
      ? 0
      : Math.round((requiredConsentedCount / REQUIRED_FIELD_IDS.length) * 40);
  reasons.push({
    id: "basic",
    label: `기본 필요 정보 ${requiredConsentedCount}/${REQUIRED_FIELD_IDS.length}개 제공`,
    score: basicScore,
    max: 40,
  });

  const goalFieldIds = getGoalConditionalFieldIds(goal);
  const goalConsentedCount = goalFieldIds.filter((id) => consent?.[id] === true).length;
  const conditionalScore =
    goalFieldIds.length === 0 ? 0 : Math.round((goalConsentedCount / goalFieldIds.length) * 20);
  reasons.push({
    id: "conditional",
    label: `목표 관련 정보 ${goalConsentedCount}/${goalFieldIds.length}개 제공`,
    score: conditionalScore,
    max: 20,
  });

  const policyCount = recommendation?.policies?.length ?? 0;
  const policyScore = Math.round(
    (Math.min(policyCount, POLICY_COUNT_FOR_FULL_SCORE) / POLICY_COUNT_FOR_FULL_SCORE) * 30
  );
  reasons.push({
    id: "policy",
    label: `매칭된 정책 ${policyCount}개`,
    score: policyScore,
    max: 30,
  });

  const hasTypeEvidence = (typeRule?.used_fields?.length ?? 0) > 0;
  const typeScore = hasTypeEvidence ? 10 : 0;
  reasons.push({
    id: "type_rule",
    label: hasTypeEvidence ? "유형 판단 근거 있음" : "유형 판단 근거 없음 (균형 관리형)",
    score: typeScore,
    max: 10,
  });

  const score = Math.max(0, Math.min(100, basicScore + conditionalScore + policyScore + typeScore));

  return { score, reasons };
}
