// 추론 컨텍스트에 규칙을 적용해 성립하는 추론 목록을 만든다.
// 매칭된 규칙마다 실제 값이 존재한 근거 필드만 남기고, 위험도가 높은 순으로 정렬한다.

import { INFERENCE_RULES, RISK_ORDER } from "./inferenceRules";

/** required_all은 전부, required_any는 (비어 있지 않다면) 하나 이상 값이 있어야 매칭. */
export function isRuleMatched(rule, context) {
  const allMatched = rule.required_all.every((field) => context[field] != null);
  const anyMatched =
    rule.required_any.length === 0 ||
    rule.required_any.some((field) => context[field] != null);
  return allMatched && anyMatched;
}

/** evidence_fields 개수로 단일/결합 정보 여부를 라벨링한다 (확률 대신 결합 정도로 표시). */
export function getCombinationLabel(evidenceFields) {
  if (evidenceFields.length >= 3) return "3개 이상 정보 결합";
  if (evidenceFields.length === 2) return "2개 정보 결합";
  return "단일 정보 기반";
}

export function evaluateInferences(context) {
  return INFERENCE_RULES.filter((rule) => isRuleMatched(rule, context))
    .map((rule) => {
      const evidence_fields = rule.evidence_fields.filter((field) => context[field] != null);
      return {
        id: rule.id,
        title: rule.title,
        message: rule.message,
        risk_level: rule.risk_level,
        risk_explanation: rule.risk_explanation,
        evidence_fields,
        combination_label: getCombinationLabel(evidence_fields),
      };
    })
    .sort((a, b) => RISK_ORDER[b.risk_level] - RISK_ORDER[a.risk_level]);
}

/** 추론 개수를 정확한 숫자 대신 대략적인 범위로 표시하기 위한 라벨. */
export function getFeedbackRange(count) {
  if (count <= 0) return "0개";
  const low = Math.max(1, count - 1);
  return `${low}~${count}개`;
}

/** STEP5 최종 산출물: 추론 목록 + STEP6이 집계에 사용할 근거 필드/개수. */
export function buildInference(context) {
  const inferences = evaluateInferences(context);
  const inference_evidence_fields = [
    ...new Set(inferences.flatMap((item) => item.evidence_fields)),
  ];

  return {
    inferences,
    inference_count: inferences.length,
    inference_evidence_fields,
    inference_evidence_field_count: inference_evidence_fields.length,
    inference_feedback_range: getFeedbackRange(inferences.length),
  };
}
