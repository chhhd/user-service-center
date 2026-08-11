// STEP3 질문 화면에서 사용하는 선택지 정의.
// 라벨/필수여부/locked여부는 DATA_FIELD_META(input_source)를 기준으로 판단하므로
// 여기서는 옵션 목록만 관리한다 (필드 정의 자체는 여전히 dataFieldMeta.js가 단일 소스).

import { FIELD_CATEGORY, getFieldsByCategory } from "../shared/dataFieldMeta";

export const QUESTION_OPTIONS = {
  age_group: ["10대", "20대 초반", "20대 후반", "30대 초반", "30대 후반"],
  job_status: ["학생", "취업준비생", "직장인", "프리랜서"],
  region: ["서울", "경기", "인천", "그 외 지역"],
  income_range: ["100만원 미만", "100~200만원", "200~300만원", "300만원 이상"],
  expense_ratio: ["소득의 30% 미만", "30~60%", "60~80%", "80% 이상"],
  housing_type: ["가족과 거주", "기숙사", "월세", "전세"],
  saving_level: ["없음", "월 10만원 미만", "월 10~30만원", "월 30만원 이상"],
  loan_status: ["없음", "학자금대출", "생활비대출", "기타"],
  spending_type: ["식비", "쇼핑", "교통", "구독서비스", "주거비"],
};

// STEP3에서 다루는 필드 = 기본 정보 + 금융생활 정보 (고위험·과도 정보는 질문으로 묻지 않는다)
export const QUESTION_FIELD_IDS = [
  ...getFieldsByCategory(FIELD_CATEGORY.BASIC),
  ...getFieldsByCategory(FIELD_CATEGORY.FINANCIAL),
];

QUESTION_FIELD_IDS.forEach((id) => {
  if (!QUESTION_OPTIONS[id]) {
    throw new Error(`QUESTION_OPTIONS에 정의되지 않은 field_id: ${id}`);
  }
});
