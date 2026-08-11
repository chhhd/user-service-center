// 개인정보 항목 정의 - STEP2~STEP7 전 단계가 이 파일 하나만 참조한다.
// field_id는 절대 변경하지 않는다 (모든 단계가 동일 field_id로 연결됨).

export const FIELD_CATEGORY = {
  BASIC: "basic", // 기본 정보
  FINANCIAL: "financial", // 금융생활 정보
  SENSITIVE: "sensitive", // 고위험·과도 정보
};

export const NECESSITY = {
  REQUIRED: "required", // 기본 필요 항목 (최소 동의에도 항상 포함)
  CONDITIONAL: "conditional", // 선택한 목표에 따라 최소 동의에 포함될 수 있음
  OPTIONAL: "optional", // 추천에는 불필요, 과도 수집 항목
};

export const SENSITIVITY = {
  NORMAL: "normal",
  HIGH: "high",
};

export const INPUT_SOURCE = {
  PROFILE: "profile", // 가상 프로필의 기본값을 그대로 사용
  INPUT: "input", // STEP3에서 참가자가 직접 구간 선택
  VIRTUAL: "virtual", // 가상 프로필의 virtual_data (동의해야만 사용)
};

// 순서 = 화면에 노출되는 기본 순서
export const DATA_FIELD_META = {
  age_group: {
    field_id: "age_group",
    label: "연령대",
    category: FIELD_CATEGORY.BASIC,
    purpose: "정책 대상 연령 확인 및 청년 정책 매칭",
    necessity: NECESSITY.REQUIRED,
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.PROFILE,
  },
  job_status: {
    field_id: "job_status",
    label: "직업 상태",
    category: FIELD_CATEGORY.BASIC,
    purpose: "취업 상태 기반 지원 정책 매칭",
    necessity: NECESSITY.REQUIRED,
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.PROFILE,
  },
  region: {
    field_id: "region",
    label: "거주 지역",
    category: FIELD_CATEGORY.BASIC,
    purpose: "지역별 청년 정책 매칭",
    necessity: NECESSITY.REQUIRED,
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.PROFILE,
  },
  income_range: {
    field_id: "income_range",
    label: "월 소득 구간",
    category: FIELD_CATEGORY.BASIC,
    purpose: "소득 구간별 지원 한도 및 자산 형성 정책 매칭",
    necessity: NECESSITY.REQUIRED,
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.INPUT,
  },
  expense_ratio: {
    field_id: "expense_ratio",
    label: "월평균 지출 수준 (소득 대비)",
    category: FIELD_CATEGORY.FINANCIAL,
    purpose: "지출 습관 기반 금융생활 유형 분류",
    necessity: NECESSITY.CONDITIONAL,
    related_goals: ["spending", "loan"],
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.INPUT,
  },
  housing_type: {
    field_id: "housing_type",
    label: "현재 주거 형태",
    category: FIELD_CATEGORY.FINANCIAL,
    purpose: "주거비 지원 정책 매칭",
    necessity: NECESSITY.CONDITIONAL,
    related_goals: ["housing"],
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.INPUT,
  },
  saving_level: {
    field_id: "saving_level",
    label: "월 저축 수준",
    category: FIELD_CATEGORY.FINANCIAL,
    purpose: "저축 습관 형성 유형 분류",
    necessity: NECESSITY.CONDITIONAL,
    related_goals: ["saving"],
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.INPUT,
  },
  loan_status: {
    field_id: "loan_status",
    label: "대출 보유 여부",
    category: FIELD_CATEGORY.FINANCIAL,
    purpose: "대출 부담 유형 분류 및 상환 지원 정책 매칭",
    necessity: NECESSITY.CONDITIONAL,
    related_goals: ["loan"],
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.INPUT,
  },
  spending_type: {
    field_id: "spending_type",
    label: "가장 지출 비중이 큰 항목",
    category: FIELD_CATEGORY.FINANCIAL,
    purpose: "소비 유형 분석 및 지출 절감 정책 매칭",
    necessity: NECESSITY.CONDITIONAL,
    related_goals: ["spending"],
    sensitivity: SENSITIVITY.NORMAL,
    input_source: INPUT_SOURCE.INPUT,
  },
  card_transactions: {
    field_id: "card_transactions",
    label: "카드 결제 내역",
    category: FIELD_CATEGORY.SENSITIVE,
    purpose: "실제 소비 패턴 정밀 분석 (AI 추론용, 추천 필수 아님)",
    necessity: NECESSITY.OPTIONAL,
    sensitivity: SENSITIVITY.HIGH,
    input_source: INPUT_SOURCE.VIRTUAL,
  },
  contact: {
    field_id: "contact",
    label: "연락처",
    category: FIELD_CATEGORY.SENSITIVE,
    purpose: "상담·알림 연락 목적 (본 체험에서는 사용하지 않음)",
    necessity: NECESSITY.OPTIONAL,
    sensitivity: SENSITIVITY.HIGH,
    input_source: INPUT_SOURCE.VIRTUAL,
  },
  sns_account: {
    field_id: "sns_account",
    label: "SNS 계정",
    category: FIELD_CATEGORY.SENSITIVE,
    purpose: "관심사·라이프스타일 추론 (AI 추론용, 추천 필수 아님)",
    necessity: NECESSITY.OPTIONAL,
    sensitivity: SENSITIVITY.HIGH,
    input_source: INPUT_SOURCE.VIRTUAL,
  },
  location_history: {
    field_id: "location_history",
    label: "위치 기록",
    category: FIELD_CATEGORY.SENSITIVE,
    purpose: "생활권역 및 이동 패턴 추론 (AI 추론용, 추천 필수 아님)",
    necessity: NECESSITY.OPTIONAL,
    sensitivity: SENSITIVITY.HIGH,
    input_source: INPUT_SOURCE.VIRTUAL,
  },
  bank_account: {
    field_id: "bank_account",
    label: "계좌번호",
    category: FIELD_CATEGORY.SENSITIVE,
    purpose: "실제 자산 확인 목적 (본 체험에서는 사용하지 않음)",
    necessity: NECESSITY.OPTIONAL,
    sensitivity: SENSITIVITY.HIGH,
    input_source: INPUT_SOURCE.VIRTUAL,
  },
};

export const ALL_FIELD_IDS = Object.keys(DATA_FIELD_META);

export const FIELD_CATEGORY_LABEL = {
  [FIELD_CATEGORY.BASIC]: "기본 정보",
  [FIELD_CATEGORY.FINANCIAL]: "금융생활 정보",
  [FIELD_CATEGORY.SENSITIVE]: "고위험·과도 정보",
};

export const NECESSITY_LABEL = {
  [NECESSITY.REQUIRED]: "필수",
  [NECESSITY.CONDITIONAL]: "목표 조건부",
  [NECESSITY.OPTIONAL]: "선택 (과도 수집 가능)",
};

export function getFieldsByCategory(category) {
  return ALL_FIELD_IDS.filter(
    (id) => DATA_FIELD_META[id].category === category
  );
}
