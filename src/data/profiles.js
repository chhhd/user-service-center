// 가상 청년 프로필 4종 - STEP1에서 선택.
// base_data: 기본 정보 + 금융생활 정보 (DATA_FIELD_META의 basic/financial 카테고리와 field_id 동일)
// virtual_data: 고위험·과도 정보 (DATA_FIELD_META의 sensitive 카테고리와 field_id 동일)
//   -> 동의(consent[field_id] === true)한 경우에만 이후 단계 계산에 사용한다.

export const PROFILES = [
  {
    id: "first_salary",
    name: "첫 월급을 받은 사회초년생",
    summary: "이제 막 취업해서 첫 월급을 받은 20대 초반 직장인",
    avatar: "🧑‍💼",
    base_data: {
      age_group: "20대 초반",
      job_status: "직장인",
      region: "서울",
      income_range: "200~300만원",
      expense_ratio: "30~60%",
      housing_type: "가족과 거주",
      saving_level: "월 10~30만원",
      loan_status: "없음",
      spending_type: "쇼핑",
    },
    virtual_data: {
      card_transactions: "카페·쇼핑몰 결제 다수, 월 평균 45만원",
      contact: "010-1234-5678",
      sns_account: "@first_salary_life",
      location_history: "강남구 오피스 - 마포구 자택 반복 이동",
      bank_account: "110-123-456789",
    },
  },
  {
    id: "student_loan",
    name: "학자금대출이 있는 취업준비생",
    summary: "학자금대출을 상환 중이며 취업을 준비하는 20대 후반",
    avatar: "📚",
    base_data: {
      age_group: "20대 후반",
      job_status: "취업준비생",
      region: "경기",
      income_range: "100만원 미만",
      expense_ratio: "60~80%",
      housing_type: "기숙사",
      saving_level: "없음",
      loan_status: "학자금대출",
      spending_type: "식비",
    },
    virtual_data: {
      card_transactions: "편의점·배달앱 결제 위주, 월 평균 25만원",
      contact: "010-2345-6789",
      sns_account: "@job_hunter_2026",
      location_history: "스터디카페·도서관 중심 이동",
      bank_account: "302-1111-2222",
    },
  },
  {
    id: "spending_management",
    name: "소비 관리가 필요한 대학생",
    summary: "온라인 쇼핑·구독 소비가 많아 지출 관리가 필요한 20대 초반 대학생",
    avatar: "🎓",
    base_data: {
      age_group: "20대 초반",
      job_status: "학생",
      region: "그 외 지역",
      income_range: "100~200만원",
      expense_ratio: "80% 이상",
      housing_type: "기숙사",
      saving_level: "없음",
      loan_status: "없음",
      spending_type: "구독서비스",
    },
    virtual_data: {
      card_transactions: "온라인 쇼핑·구독 결제 다수, 월 평균 38만원",
      contact: "010-3456-7890",
      sns_account: "@campus_shopper",
      location_history: "학교 - 번화가 반복 이동",
      bank_account: "352-2222-3333",
    },
  },
  {
    id: "independence",
    name: "독립을 준비하는 청년",
    summary: "월세로 독립해 생활비·주거비 부담이 큰 20대 후반 직장인",
    avatar: "🏡",
    base_data: {
      age_group: "20대 후반",
      job_status: "직장인",
      region: "인천",
      income_range: "200~300만원",
      expense_ratio: "60~80%",
      housing_type: "월세",
      saving_level: "월 10만원 미만",
      loan_status: "생활비대출",
      spending_type: "주거비",
    },
    virtual_data: {
      card_transactions: "가구·생활용품 결제 다수, 월 평균 52만원",
      contact: "010-4567-8901",
      sns_account: "@moving_out_soon",
      location_history: "부동산 중개소·이사 관련 장소 방문 기록",
      bank_account: "110-987-654321",
    },
  },
];

export function getProfileById(profileId) {
  return PROFILES.find((p) => p.id === profileId) ?? null;
}
