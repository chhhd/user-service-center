// 추론 입력 컨텍스트 생성.
// 동의(consent[field_id] === true)한 항목만 값을 채우고, 나머지는 null로 둔다.
// 입력형 값은 answers에서, 값을 직접 입력하지 않는 고위험 항목은 가상 프로필의 virtual_data에서 가져온다.
// 동의하지 않은 정보는 프로필에 값이 있어도 절대 컨텍스트에 넣지 않는다.

import { ALL_FIELD_IDS } from "../shared/dataFieldMeta";

export function buildInferenceContext({ profile, consent, answers }) {
  const context = {};

  for (const fieldId of ALL_FIELD_IDS) {
    if (consent?.[fieldId] !== true) {
      context[fieldId] = null;
      continue;
    }
    context[fieldId] =
      answers?.[fieldId] ?? profile?.virtual_data?.[fieldId] ?? null;
  }

  return context;
}
