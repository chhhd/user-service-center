// STEP4 (B) 정책 매칭 규칙표 — 2026년 기준 실제 청년 금융정책 반영
//
// ⚠️ 부스 안내 문구 필수: "실제 정책명을 참고용으로 표시하며, 본 화면의 매칭 결과는
// 정부·지자체의 공식 자격 심사가 아닙니다. 실제 신청 가능 여부는 각 사업 공고를 확인하세요."
// (연령·소득 구간이 실제 사업의 세부 기준과 100% 일치하지 않을 수 있음을 부스 운영진이 인지할 것)
//
// 유형 분류와 별개로, 개별 필드 조건에 따라 독립적으로 매칭되며 여러 개가 동시에 매칭될 수 있다.
// condition 값이 "*"이면 해당 필드 값이 null만 아니면 매칭된 것으로 처리한다.
// source: 실제 정책 근거를 부스 운영진이 참고할 수 있도록 남겨둔 메모 (화면에는 노출하지 않음).

export const POLICY_RULES = [
  {
    policy: "청년도약계좌",
    description: "만 19~34세 근로·사업소득 청년이 5년간 매월 최대 70만원을 저축하면 정부기여금과 비과세 혜택을 더해 목돈을 만드는 자산형성 상품",
    condition: {
      age_group: ["20대 초반", "20대 후반", "30대 초반"],
      job_status: ["직장인", "프리랜서"],
    },
    used_fields: ["age_group", "job_status"],
    source: "금융위원회·서민금융진흥원, 2026년 기준",
  },
  {
    policy: "청년내일저축계좌",
    description: "기준 중위소득 50% 이하 근로 청년이 매월 10만원 이상 저축하면 정부가 매월 30만원을 정액 매칭 적립해주는 저소득 청년 자산형성 사업",
    condition: {
      job_status: ["직장인", "프리랜서"],
      income_range: ["100만원 미만", "100~200만원"],
    },
    used_fields: ["job_status", "income_range"],
    source: "보건복지부, 2026년 기준",
  },
  {
    policy: "청년월세 한시특별지원",
    description: "무주택 월세 거주 청년에게 월 최대 20만원, 최대 24개월간 월세를 현금으로 지원하는 상시 신청 제도",
    condition: {
      housing_type: ["월세"],
      income_range: ["100만원 미만", "100~200만원", "200~300만원"],
    },
    used_fields: ["housing_type", "income_range"],
    source: "국토교통부, 2026년 기준",
  },
  {
    policy: "청년버팀목전세자금대출",
    description: "만 19~34세 무주택 세대주(예정자) 청년에게 최저 2%대 초저금리로 전세보증금을 대출해주는 주택도시기금 상품",
    condition: {
      housing_type: ["전세"],
      age_group: ["20대 초반", "20대 후반", "30대 초반"],
    },
    used_fields: ["housing_type", "age_group"],
    source: "국토교통부·주택도시기금, 2026년 기준",
  },
  {
    policy: "취업 후 학자금 상환 특별지원",
    description: "학자금대출 상환 부담이 있는 청년을 대상으로 상환유예·감면 및 저리 대환 상품을 안내하는 지원 제도",
    condition: {
      loan_status: ["학자금대출"],
    },
    used_fields: ["loan_status"],
    source: "한국장학재단, 2026년 기준",
  },
  {
    policy: "햇살론유스",
    description: "만 34세 이하 사회초년생·대학(원)생 등을 대상으로 생활비·긴급자금 목적의 소액 정책서민금융 대출을 지원하는 제도",
    condition: {
      loan_status: ["생활비대출", "기타"],
    },
    used_fields: ["loan_status"],
    source: "서민금융진흥원, 2026년 기준",
  },
  {
    policy: "청년구직활동지원금",
    description: "미취업 청년의 구직활동에 필요한 생활비를 최대 6개월간 지원하는 취업준비 청년 대상 제도",
    condition: {
      job_status: ["취업준비생"],
    },
    used_fields: ["job_status"],
    source: "고용노동부, 2026년 기준",
  },
  {
    policy: "서울 희망두배 청년통장",
    description: "서울 거주 저축 여력이 적은 청년이 매월 일정액을 저축하면 서울시가 동일 금액을 추가 적립해주는 지역 특화 자산형성 사업 (지자체별 유사 사업 존재)",
    condition: {
      region: ["서울"],
      saving_level: ["없음", "월 10만원 미만"],
    },
    used_fields: ["region", "saving_level"],
    source: "서울시, 2026년 기준 (타 지자체는 별도 사업 확인 필요)",
  },
  {
    policy: "서울 영테크 2.0 (청년 금융교육·상담)",
    description: "지출 비중이 높은 청년에게 무료 1:1 재무상담과 소비·부채 관리 교육을 제공하는 지자체 금융교육 프로그램",
    condition: {
      region: ["서울"],
      expense_ratio: ["60~80%", "80% 이상"],
      spending_type: "*",
    },
    used_fields: ["region", "expense_ratio", "spending_type"],
    source: "서울시, 2026년 기준",
  },
];
