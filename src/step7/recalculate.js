// STEP7 재계산 로직: STEP3의 answers 생성 규칙을 그대로 따르되,
// 이번에 새로 동의한 항목을 이 화면에서 바로 답할 수 있게 한다.
// - 동의하지 않은 항목은 값이 있어도 null 처리한다 (STEP3와 동일한 규칙).
// - PROFILE 출처는 항상 프로필 기본값을 그대로 사용한다.
// - INPUT 출처는 이번 화면에서 고른 값(selections)을 우선하고, 없으면 이전 답변을 유지한다.

import { QUESTION_FIELD_IDS } from "../step3/questionOptions";
import { DATA_FIELD_META, INPUT_SOURCE } from "../shared/dataFieldMeta";

export function buildRecalcAnswers({ consent, profile, previousAnswers, selections }) {
  const answers = {};

  QUESTION_FIELD_IDS.forEach((id) => {
    if (consent[id] !== true) {
      answers[id] = null;
    } else if (DATA_FIELD_META[id].input_source === INPUT_SOURCE.PROFILE) {
      answers[id] = profile.base_data[id];
    } else {
      answers[id] = selections[id] ?? previousAnswers[id] ?? null;
    }
  });

  return answers;
}

/** 현재 consent 기준으로, 이번 화면에서 참가자가 직접 답해야 하는 INPUT 항목 목록. */
export function getEditableInputFieldIds(consent) {
  return QUESTION_FIELD_IDS.filter(
    (id) => consent[id] === true && DATA_FIELD_META[id].input_source === INPUT_SOURCE.INPUT
  );
}

/** STEP7에서 동의/데이터 활용 범위를 STEP6과 다르게 실제로 바꿨는지 판정한다.
 *  STEP7을 그냥 통과하기만 한 경우(before_snapshot과 동일)와 구분하기 위한 값이다. */
export function hasChangedFromSnapshot({ before_snapshot, consent, data_controls }) {
  if (!before_snapshot) return false;
  return (
    JSON.stringify(consent) !== JSON.stringify(before_snapshot.consent) ||
    JSON.stringify(data_controls) !== JSON.stringify(before_snapshot.data_controls)
  );
}
