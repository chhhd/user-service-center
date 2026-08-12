import { useState } from "react";
import StepHeader from "../shared/StepHeader";
import LockedFieldGroup from "./LockedFieldGroup";
import QuestionList from "./QuestionList";
import { QUESTION_FIELD_IDS } from "./questionOptions";
import { useJourney } from "../shared/journeyStore";
import { DATA_FIELD_META, INPUT_SOURCE } from "../shared/dataFieldMeta";
import { getGoalById } from "../data/financialGoals";

// STEP3 처리 규칙: consent[field_id] !== true 인 항목은 화면과 계산에서 제외한다.
// 동의하지 않은 항목의 값은 절대 answers에 채워 넣지 않는다 (STEP4 로직 오염 방지).
export default function Step3Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { profile, goal, consent, answers: savedAnswers } = journey;
  const goalInfo = getGoalById(goal);

  const visibleFieldIds = QUESTION_FIELD_IDS.filter((id) => consent[id] === true);
  const lockedFieldIds = visibleFieldIds.filter(
    (id) => DATA_FIELD_META[id].input_source === INPUT_SOURCE.PROFILE
  );
  const inputFieldIds = visibleFieldIds.filter(
    (id) => DATA_FIELD_META[id].input_source === INPUT_SOURCE.INPUT
  );

  // 뒤로 이동했다 돌아와도 기존 답변을 유지한다.
  const [selections, setSelections] = useState(() => {
    const init = {};
    inputFieldIds.forEach((id) => {
      if (savedAnswers[id] != null) init[id] = savedAnswers[id];
    });
    return init;
  });

  function handleSelect(fieldId, value) {
    setSelections((prev) => ({ ...prev, [fieldId]: value }));
  }

  const isComplete = inputFieldIds.every((id) => selections[id] != null);

  function handleNext() {
    const answers = {};
    QUESTION_FIELD_IDS.forEach((id) => {
      if (consent[id] !== true) {
        answers[id] = null;
      } else if (DATA_FIELD_META[id].input_source === INPUT_SOURCE.PROFILE) {
        answers[id] = profile.base_data[id];
      } else {
        answers[id] = selections[id];
      }
    });
    actions.setAnswers(answers);
    onNext();
  }

  return (
    <div className="screen">
      <StepHeader step={3} total={7} title="금융생활 정보를 입력해 주세요" />

      {profile && (
        <p className="context-line">
          선택한 프로필 <strong>{profile.avatar} {profile.name}</strong> · 목표{" "}
          <strong>{goalInfo?.label}</strong>
        </p>
      )}

      <p className="screen-desc">
        STEP2에서 동의하지 않은 항목은 프로필에 값이 있어도 여기 나타나지 않고, 이후 추천·추론에도 사용되지 않아요.
      </p>

      <LockedFieldGroup fieldIds={lockedFieldIds} profile={profile} />
      <QuestionList fieldIds={inputFieldIds} answers={selections} onSelect={handleSelect} />

      <div className="screen-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button type="button" className="btn btn-primary" disabled={!isComplete} onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
}
