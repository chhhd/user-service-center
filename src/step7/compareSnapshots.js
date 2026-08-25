// STEP6에서 만든 before_snapshot과 STEP7 재계산 결과(after)를 비교한다.
// 참가자를 평가하는 표현은 쓰지 않고, 개수·목록 차이로만 보여준다.

import { getConsentedFieldIds } from "../shared/consentRules";

function diffLists(before, after) {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    added: after.filter((id) => !beforeSet.has(id)),
    removed: before.filter((id) => !afterSet.has(id)),
  };
}

/** after = { consent, recommendation, type_rule, usage_report, privacy_risk } */
export function compareSnapshots({ before_snapshot, after }) {
  if (!before_snapshot) return null;

  const beforeConsentIds = getConsentedFieldIds(before_snapshot.consent);
  const afterConsentIds = getConsentedFieldIds(after.consent);
  const consentDiff = diffLists(beforeConsentIds, afterConsentIds);

  const beforePolicies = before_snapshot.recommendation_signature?.policies ?? [];
  const afterPolicies = after.recommendation.policies.map((p) => p.policy);
  const policyDiff = diffLists(beforePolicies, afterPolicies);

  const beforeTypeUsed = before_snapshot.type_rule?.used_fields ?? [];
  const afterTypeUsed = after.type_rule?.used_fields ?? [];
  const typeUsedDiff = diffLists(beforeTypeUsed, afterTypeUsed);

  const beforeRisk = before_snapshot.privacy_risk ?? { score: 0, level: null };
  const beforeUsage = before_snapshot.usage_report ?? {
    recommendation_used_count: 0,
    inference_evidence_field_count: 0,
  };

  return {
    consent_count_before: beforeConsentIds.length,
    consent_count_after: afterConsentIds.length,
    consent_added: consentDiff.added,
    consent_removed: consentDiff.removed,

    type_before: before_snapshot.recommendation_signature?.type ?? null,
    type_after: after.recommendation.type,
    type_changed:
      (before_snapshot.recommendation_signature?.type ?? null) !== after.recommendation.type,
    type_used_added: typeUsedDiff.added,
    type_used_removed: typeUsedDiff.removed,

    policies_added: policyDiff.added,
    policies_removed: policyDiff.removed,

    recommendation_used_count_before: beforeUsage.recommendation_used_count,
    recommendation_used_count_after: after.usage_report.recommendation_used_count,
    inference_evidence_count_before: beforeUsage.inference_evidence_field_count,
    inference_evidence_count_after: after.usage_report.inference_evidence_field_count,

    risk_score_before: beforeRisk.score,
    risk_score_after: after.privacy_risk.score,
    risk_score_delta: after.privacy_risk.score - beforeRisk.score,
    risk_level_before: beforeRisk.level,
    risk_level_after: after.privacy_risk.level,
    risk_level_changed: beforeRisk.level !== after.privacy_risk.level,
  };
}
