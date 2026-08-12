// STEP6 데이터 활용 리포트 집계.
// 모든 개수는 동의(consent[field] === true)한 field_id의 고유 개수를 기준으로 계산한다.
// STEP4에서 넘어온 개수를 그대로 쓰지 않고 STEP2 consent를 기준으로 다시 검증한다
// (입력하지 않는 항목이 빠지면서 총동의 수가 어긋나는 것을 막는다).

import { ALL_FIELD_IDS, DATA_FIELD_META } from "../shared/dataFieldMeta";
import { RETENTION_PERIOD } from "../shared/journeyStore";

// 장기 보관으로 취급하는 보관 기간 (체험 종료 후 삭제는 제외).
const LONG_TERM_PERIODS = [RETENTION_PERIOD.DAYS_30, RETENTION_PERIOD.UNLIMITED];

/** 중복을 제거하고 동의·정의가 유효한 field_id만 남긴다. */
function uniqueValidFields(fields, consent) {
  return [...new Set(fields)].filter(
    (field) => consent[field] === true && DATA_FIELD_META[field]
  );
}

export function buildUsageReport({ consent, data_controls, recommendation, inference }) {
  const consentedFields = ALL_FIELD_IDS.filter((field) => consent[field] === true);

  const recommendationUsedFields = uniqueValidFields(recommendation.used_fields, consent);
  const recommendationUnusedFields = consentedFields.filter(
    (field) => !recommendationUsedFields.includes(field)
  );

  const inferenceEvidenceFields = uniqueValidFields(
    inference.inference_evidence_fields,
    consent
  );

  const thirdPartyFields = data_controls.third_party_agreed
    ? uniqueValidFields(data_controls.third_party_fields ?? [], consent)
    : [];

  const longTermFields = LONG_TERM_PERIODS.includes(data_controls.retention_period)
    ? uniqueValidFields(data_controls.retention_fields ?? [], consent)
    : [];

  return {
    consented_fields: consentedFields,
    consented_count: consentedFields.length,
    recommendation_used_fields: recommendationUsedFields,
    recommendation_used_count: recommendationUsedFields.length,
    recommendation_unused_fields: recommendationUnusedFields,
    recommendation_unused_count: recommendationUnusedFields.length,
    inference_evidence_fields: inferenceEvidenceFields,
    inference_evidence_field_count: inferenceEvidenceFields.length,
    third_party_fields: thirdPartyFields,
    third_party_count: thirdPartyFields.length,
    long_term_fields: longTermFields,
    long_term_count: longTermFields.length,
  };
}
