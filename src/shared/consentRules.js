// STEP2 동의 방식(전체/맞춤/최소) 계산 로직
// - 이 파일은 순수 함수만 제공한다 (journeyStore의 reducer에서 호출).

import { ALL_FIELD_IDS, DATA_FIELD_META, NECESSITY } from "./dataFieldMeta";

export const CONSENT_MODE = {
  FULL: "full",
  CUSTOM: "custom",
  MINIMAL: "minimal",
};

/** 전체 동의: 모든 필드를 true로 선택 */
export function computeFullConsent() {
  return ALL_FIELD_IDS.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {});
}

/**
 * 최소 동의: 기본 필요 항목(required) + 선택한 목표에 직접 필요한 조건부 항목(conditional)만 true.
 * 고위험·과도 정보(optional)는 목표와 무관하게 항상 false.
 */
export function computeMinimalConsent(goalId) {
  return ALL_FIELD_IDS.reduce((acc, id) => {
    const meta = DATA_FIELD_META[id];
    if (meta.necessity === NECESSITY.REQUIRED) {
      acc[id] = true;
    } else if (
      meta.necessity === NECESSITY.CONDITIONAL &&
      Array.isArray(meta.related_goals) &&
      goalId != null &&
      meta.related_goals.includes(goalId)
    ) {
      acc[id] = true;
    } else {
      acc[id] = false;
    }
    return acc;
  }, {});
}

/** 아직 아무것도 선택하지 않은 상태 (맞춤 동의 최초 진입 시 기본값) */
export function computeEmptyConsent() {
  return ALL_FIELD_IDS.reduce((acc, id) => {
    acc[id] = false;
    return acc;
  }, {});
}

/** consent 객체 중 true인 field_id 배열 */
export function getConsentedFieldIds(consent) {
  return ALL_FIELD_IDS.filter((id) => consent?.[id] === true);
}
