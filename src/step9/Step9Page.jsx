import StepHeader from "../shared/StepHeader";
import ResultTypeCard from "../result/ResultTypeCard";
import { useIdleReset } from "./useIdleReset";
import { useJourney } from "../shared/journeyStore";

const IDLE_TIMEOUT_MS = 60_000;
const WARNING_LEAD_MS = 10_000;

// STEP9: 부스 마무리 및 상태 초기화.
// - journey.result(STEP8에서 저장)를 읽어 유형 카드 / 한 줄 메시지 / 개인정보 실천 수칙 / 운영자용
//   스티커 색상을 보여준다.
// - 실제 개인정보가 저장되지 않았다는 안내와 새 체험 시작 버튼을 제공한다.
// - 60초 동안 조작이 없으면 자동으로 초기화하고, 그 10초 전부터 경고 배너를 보여준다. 조작이 발생하면
//   타이머가 취소(재시작)된다.
export default function Step9Page({ onRestart }) {
  const { journey, actions } = useJourney();
  const { profile, result } = journey;

  function handleRestart() {
    actions.reset();
    onRestart();
  }

  const { showWarning } = useIdleReset({
    idleTimeoutMs: IDLE_TIMEOUT_MS,
    warningLeadMs: WARNING_LEAD_MS,
    onIdle: handleRestart,
  });

  const resultType = result && {
    id: result.result_type,
    type: result.result_type_label,
    message: result.result_type_message,
    practice_tip: result.result_type_practice_tip,
    sticker_color: result.result_type_sticker_color,
  };

  return (
    <div className="screen intro-screen">
      <StepHeader step={9} total={9} title="체험이 끝났어요" />

      {showWarning && (
        <div className="notice-banner">
          <strong>곧 초기화돼요</strong>
          <p>10초 동안 조작이 없으면 다음 참가자를 위해 자동으로 초기화돼요. 화면을 터치하면 취소돼요.</p>
        </div>
      )}

      {resultType && <ResultTypeCard resultType={resultType} showStickerNote />}

      {resultType?.practice_tip && (
        <section className="practice-tip-panel">
          <h3 className="field-group-title">개인정보 실천 수칙</h3>
          <p className="screen-desc">{resultType.practice_tip}</p>
        </section>
      )}

      <p className="intro-desc">
        {profile ? `${profile.name}님, ` : ""}체험해 주셔서 감사해요.
        <br />
        오늘 입력한 정보는 실제 개인정보가 아니며, 이 화면을 벗어나는 순간 브라우저 메모리에서
        사라지고 서버에도 저장되지 않았어요.
      </p>

      <button type="button" className="btn btn-primary btn-large" onClick={handleRestart}>
        다음 참가자를 위해 초기화하기
      </button>
    </div>
  );
}
