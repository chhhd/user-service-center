// STEP4 핵심 로직: answers 객체를 넣으면 recommendation/type_rule이 나오는 순수 함수들.
// STEP7에서 동의를 다시 선택했을 때도 새 계산식 없이 이 함수들을 그대로 재호출한다.

import { TYPE_RULES } from "./rules/typeRules";
import { POLICY_RULES } from "./rules/policyRules";

/** 우선순위가 높은 규칙부터 검사해 첫 번째로 매칭되는 유형 규칙을 반환한다.
 *  마지막 규칙은 condition이 {}라서 항상 매칭되는 fallback이다. */
export function classifyType(answers) {
  for (const rule of TYPE_RULES) {
    const matched = Object.entries(rule.condition).every(([field, allowed]) =>
      allowed.includes(answers[field])
    );
    if (matched) return rule;
  }
  return TYPE_RULES[TYPE_RULES.length - 1];
}

/** 유형과 독립적으로, 조건을 만족하는 정책을 모두 매칭한다 (여러 개 동시 매칭 가능). */
export function matchPolicies(answers) {
  return POLICY_RULES.filter((rule) =>
    Object.entries(rule.condition).every(([field, cond]) =>
      cond === "*" ? answers[field] != null : cond.includes(answers[field])
    )
  );
}

/** 추천(유형 판단 + 정책 매칭)에 실제로 사용된 필드와, 동의했지만 사용되지 않은 필드를 계산한다. */
export function trackFieldUsage(answers, typeRule, policies) {
  const usedFields = new Set([
    ...typeRule.used_fields,
    ...policies.flatMap((p) => p.used_fields),
  ]);
  const consentedFields = Object.keys(answers).filter((k) => answers[k] !== null);
  const unusedFields = consentedFields.filter((k) => !usedFields.has(k));

  return {
    used_fields: [...usedFields],
    unused_fields: unusedFields,
    used_count: usedFields.size,
    consented_count: consentedFields.length,
  };
}

/** payload.answers -> { recommendation, type_rule } */
export function recommend({ answers }) {
  const typeRule = classifyType(answers);
  const policies = matchPolicies(answers);
  const usage = trackFieldUsage(answers, typeRule, policies);

  return {
    recommendation: {
      type: typeRule.type,
      messages: typeRule.messages,
      policies: policies.map((p) => ({ policy: p.policy, description: p.description })),
      used_fields: usage.used_fields,
      unused_fields: usage.unused_fields,
      used_count: usage.used_count,
      consented_count: usage.consented_count,
    },
    type_rule: {
      id: typeRule.id,
      type: typeRule.type,
      used_fields: typeRule.used_fields,
    },
  };
}
