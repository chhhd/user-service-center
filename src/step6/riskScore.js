// 개인정보 위험도 계산.
// 점수는 0~100으로 제한하며, 총점뿐 아니라 어떤 선택이 몇 점을 움직였는지(reasons)도 함께 반환한다.
// 참가자를 평가하는 점수가 아니라 선택 상태를 설명하기 위한 값이다.

import { ALL_FIELD_IDS, DATA_FIELD_META, NECESSITY, SENSITIVITY } from "../shared/dataFieldMeta";
import { RETENTION_PERIOD } from "../shared/journeyStore";

export function calculatePrivacyRisk({ consent, data_controls }) {
  const consentedFields = ALL_FIELD_IDS.filter((field) => consent[field] === true);
  const allAgreed = consentedFields.length === ALL_FIELD_IDS.length;

  // 추천에 불필요한 과도 수집 항목.
  const unnecessaryFields = consentedFields.filter(
    (field) => DATA_FIELD_META[field].necessity === NECESSITY.OPTIONAL
  );
  const highRiskFields = consentedFields.filter(
    (field) => DATA_FIELD_META[field].sensitivity === SENSITIVITY.HIGH
  );

  const reasons = [];

  if (allAgreed) {
    reasons.push({ id: "all_agree", label: "전체 동의 사용", delta: 15 });
  } else {
    reasons.push({ id: "selective", label: "선택 동의 사용", delta: -10 });
  }

  for (const field of unnecessaryFields) {
    reasons.push({
      id: `unnecessary_${field}`,
      label: `${DATA_FIELD_META[field].label}, 추천 목적과 관련 낮음`,
      delta: 8,
    });
  }

  for (const field of highRiskFields) {
    reasons.push({
      id: `high_risk_${field}`,
      label: `${DATA_FIELD_META[field].label}, 고위험 정보`,
      delta: 15,
    });
  }

  if (data_controls.retention_period === RETENTION_PERIOD.UNLIMITED) {
    reasons.push({ id: "indefinite", label: "무기한 보관", delta: 15 });
  } else if (data_controls.retention_period === RETENTION_PERIOD.DAYS_30) {
    reasons.push({ id: "limited", label: "보관 기간 제한", delta: -10 });
  } else if (data_controls.retention_period === RETENTION_PERIOD.DELETE_AFTER_EXPERIENCE) {
    reasons.push({ id: "delete", label: "체험 종료 후 삭제", delta: -15 });
  }

  if (data_controls.third_party_agreed === true && data_controls.third_party_notice_checked !== true) {
    reasons.push({ id: "third_party_unchecked", label: "제3자 제공 내용 미확인", delta: 15 });
  }

  const rawScore = reasons.reduce((sum, item) => sum + item.delta, 0);
  const score = Math.max(0, Math.min(100, rawScore));

  return {
    score,
    level: score >= 70 ? "높음" : score >= 40 ? "주의" : "낮음",
    reasons,
  };
}
