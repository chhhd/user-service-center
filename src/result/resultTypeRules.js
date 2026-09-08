// STEP8 최종 유형(위험도 x 활용도 사분면) 분류.
// 우선순위가 높은 규칙부터 검사해 첫 번째로 매칭되는 유형 1개를 선택한다 (TYPE_RULES와 동일한 패턴).
// 명확한 위험 행동(제3자 제공 내용 미확인 등)은 사분면 위치와 무관하게 가장 먼저 "동의 확인 필요형"으로
// 판정한다. 마지막 규칙은 fallback으로 항상 매칭되어 반드시 한 유형이 나오게 한다.
//
// 활용도 50점, 위험도는 STEP6에서 이미 쓰고 있는 "높음"(70점 이상) 기준을 그대로 사용해 사분면을 나눈다.

export const UTILITY_HIGH_THRESHOLD = 50;

export const RESULT_TYPE_RULES = [
  {
    priority: 1,
    id: "consent_check_needed",
    type: "동의 확인 필요형",
    match: ({ utility_score, risk_level, data_controls }) =>
      (data_controls.third_party_agreed === true && data_controls.third_party_notice_checked !== true) ||
      (utility_score < UTILITY_HIGH_THRESHOLD && risk_level === "높음"),
    message:
      "제공한 정보에 비해 위험 요소를 충분히 확인하지 않은 선택이었어요. 제3자 제공 내용과 보관 기간을 다시 살펴보면 좋겠어요.",
    sticker_color: "red",
    practice_tip: "제3자 제공·보관 기간 항목은 체크만 하지 말고 내용을 꼭 읽어본 뒤 동의하세요.",
  },
  {
    priority: 2,
    id: "convenience_first",
    type: "편리함 우선형",
    match: ({ utility_score, risk_level }) =>
      utility_score >= UTILITY_HIGH_THRESHOLD && risk_level === "높음",
    message: "많은 정보를 제공해 다양한 혜택을 확인했지만, 그만큼 개인정보 위험도 함께 높아졌어요.",
    sticker_color: "orange",
    practice_tip: "서비스에 가입하기 전, 필요 이상으로 정보를 내주고 있지 않은지 한 번 더 점검해보세요.",
  },
  {
    priority: 3,
    id: "balanced",
    type: "균형 잡힌 선택형",
    match: ({ utility_score, risk_level }) =>
      utility_score >= UTILITY_HIGH_THRESHOLD && risk_level !== "높음",
    message: "필요한 정보를 적절히 제공하면서 위험은 낮게 유지한 균형 잡힌 선택이었어요.",
    sticker_color: "green",
    practice_tip: "지금처럼 목적에 맞는 정보만 선택적으로 제공하는 습관을 계속 유지해보세요.",
  },
  {
    priority: 4,
    id: "cautious_minimal",
    type: "신중한 최소 제공형",
    match: () => true,
    message: "개인정보 제공을 최소화해 위험은 낮췄지만, 그만큼 받을 수 있는 혜택도 줄었어요.",
    sticker_color: "blue",
    practice_tip: "받고 싶은 혜택이 있다면, 그 혜택과 관련된 항목만 선택적으로 동의를 넓혀보는 것도 방법이에요.",
  },
];

/** { utility_score, risk_score, risk_level, data_controls } -> RESULT_TYPE_RULES의 항목 1개 */
export function classifyResultType({ utility_score, risk_score, risk_level, data_controls }) {
  for (const rule of RESULT_TYPE_RULES) {
    if (rule.match({ utility_score, risk_score, risk_level, data_controls })) return rule;
  }
  return RESULT_TYPE_RULES[RESULT_TYPE_RULES.length - 1];
}
