// 금융 목표 4종 - STEP1에서 선택, 최소 동의(STEP2) 조건부 항목 판정에도 사용된다.

export const FINANCIAL_GOALS = [
  {
    id: "saving",
    label: "저축 시작하기",
    description: "소액이라도 꾸준히 모으는 저축 습관을 만들고 싶어요.",
    icon: "💰",
  },
  {
    id: "spending",
    label: "소비 줄이기",
    description: "새는 지출을 파악하고 소비 습관을 관리하고 싶어요.",
    icon: "🧾",
  },
  {
    id: "housing",
    label: "월세 지원 찾기",
    description: "주거비 부담을 줄여줄 청년 지원 정책을 찾고 싶어요.",
    icon: "🏠",
  },
  {
    id: "loan",
    label: "대출 부담 줄이기",
    description: "학자금·생활비 대출 상환 부담을 줄이고 싶어요.",
    icon: "📉",
  },
];

export function getGoalById(goalId) {
  return FINANCIAL_GOALS.find((g) => g.id === goalId) ?? null;
}
