// STEP5 추론 규칙표.
// 각 규칙은 어떤 정보 조합이 있어야 추론이 성립하는지(required_all / required_any)와
// STEP6 리포트에서 근거로 집계할 필드(evidence_fields)를 함께 담는다.
// - required_all: 나열된 항목이 모두 있어야 매칭
// - required_any: 비어 있지 않다면 그중 하나 이상이 있어야 매칭
// risk_level은 실제 확률값이 아니라 결합 위험을 설명하기 위한 등급이다.

export const RISK_LEVEL = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

// 위험도가 높은 추론부터 먼저 노출하기 위한 정렬 가중치.
export const RISK_ORDER = {
  [RISK_LEVEL.CRITICAL]: 4,
  [RISK_LEVEL.HIGH]: 3,
  [RISK_LEVEL.MEDIUM]: 2,
  [RISK_LEVEL.LOW]: 1,
};

export const RISK_LEVEL_LABEL = {
  [RISK_LEVEL.CRITICAL]: "매우 높음",
  [RISK_LEVEL.HIGH]: "높음",
  [RISK_LEVEL.MEDIUM]: "보통",
  [RISK_LEVEL.LOW]: "낮음",
};

export const INFERENCE_RULES = [
  {
    id: "economic_margin",
    title: "경제적 여유 수준",
    required_all: ["income_range", "expense_ratio"],
    required_any: ["housing_type", "saving_level"],
    evidence_fields: ["income_range", "expense_ratio", "housing_type", "saving_level"],
    risk_level: RISK_LEVEL.HIGH,
    message: "소득과 지출, 주거 또는 저축 정보를 결합하면 경제적 여유가 크지 않을 가능성을 추정할 수 있습니다.",
    risk_explanation:
      "지원 대상 선별에는 도움이 될 수 있지만 금융 취약 계층으로 단정하거나 차별하는 근거가 될 수 있습니다.",
  },
  {
    id: "independence_and_living_area",
    title: "독립 여부와 생활권",
    required_all: ["region", "housing_type"],
    required_any: [],
    evidence_fields: ["region", "housing_type"],
    risk_level: RISK_LEVEL.MEDIUM,
    message: "거주 지역과 주거 형태를 결합하면 독립 여부와 주된 생활권을 추정할 수 있습니다.",
    risk_explanation: "지역과 주거 상태가 세분화될수록 개인을 구분할 수 있는 가능성이 커집니다.",
  },
  {
    id: "financial_vulnerability",
    title: "경제적 취약 가능성",
    required_all: ["loan_status", "saving_level"],
    required_any: ["income_range", "expense_ratio"],
    evidence_fields: ["loan_status", "saving_level", "income_range", "expense_ratio"],
    risk_level: RISK_LEVEL.HIGH,
    message: "대출과 저축 수준을 다른 금융 정보와 결합하면 경제적 취약 가능성을 추정할 수 있습니다.",
    risk_explanation: "추정 결과가 대출, 보험, 광고 대상 선정에 쓰이면 불이익으로 이어질 수 있습니다.",
  },
  {
    id: "lifestyle_and_interest",
    title: "생활 습관과 관심 분야",
    required_all: [],
    required_any: ["spending_type", "card_transactions"],
    evidence_fields: ["spending_type", "card_transactions"],
    risk_level: RISK_LEVEL.MEDIUM,
    message: "소비 특징이나 상세 결제 내역을 통해 생활 습관과 관심 분야를 추정할 수 있습니다.",
    risk_explanation: "정책 추천에 필요하지 않은 상세 소비 정보까지 광고나 프로파일링에 활용될 수 있습니다.",
  },
  {
    id: "daily_routine",
    title: "자주 방문하는 장소와 생활 패턴",
    required_all: ["location_history"],
    required_any: [],
    evidence_fields: ["location_history"],
    risk_level: RISK_LEVEL.HIGH,
    message: "최근 위치 기록을 통해 자주 방문하는 장소와 일상적인 이동 패턴을 추정할 수 있습니다.",
    risk_explanation: "반복되는 위치는 집, 학교, 직장처럼 개인의 주요 생활 공간을 드러낼 수 있습니다.",
  },
  {
    id: "preference_and_relationship",
    title: "취향과 관계 정보",
    required_all: ["sns_account"],
    required_any: [],
    evidence_fields: ["sns_account"],
    risk_level: RISK_LEVEL.HIGH,
    message: "SNS 활동 정보가 결합되면 취향, 관심사, 인간관계의 일부를 추정할 수 있습니다.",
    risk_explanation: "추천 목적과 직접 관련이 없는데도 성향 분석이나 맞춤 광고에 이용될 수 있습니다.",
  },
  {
    id: "financial_identity_linkage",
    title: "금융 정보와 개인의 직접 연결",
    required_all: ["bank_account"],
    required_any: ["contact"],
    evidence_fields: ["bank_account", "contact"],
    risk_level: RISK_LEVEL.CRITICAL,
    message: "정확한 계좌번호에 연락처가 결합되면 금융 정보가 특정 개인과 더 직접적으로 연결될 수 있습니다.",
    risk_explanation: "청년정책 추천에는 필요하지 않은 고위험 정보이며 유출 시 피해가 클 수 있습니다.",
  },
];
