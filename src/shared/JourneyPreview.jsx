import { useJourney } from "./journeyStore";

// STEP7 이후가 아직 구현되지 않아, 지금까지 쌓인 journey 상태를 확인하기 위한 임시 점검 화면.
export default function JourneyPreview({ onRestart }) {
  const { journey, actions } = useJourney();
  const {
    profile,
    goal,
    consent_mode,
    consent,
    data_controls,
    answers,
    recommendation,
    type_rule,
    inference,
    inference_feedback,
    usage_report,
    privacy_risk,
    before_snapshot,
  } = journey;

  const preview = {
    profile: profile && { id: profile.id, name: profile.name },
    goal,
    consent_mode,
    consent,
    data_controls,
    answers,
    recommendation,
    type_rule,
    inference,
    inference_feedback,
    usage_report,
    privacy_risk,
    before_snapshot,
  };

  return (
    <div className="screen">
      <h2 className="step-header-title">STEP 6까지 완료 ✅</h2>
      <p className="screen-desc">
        STEP 7(동의 내역 다시 선택하기)부터는 아직 구현되지 않았어요. 지금까지 저장된 상태와 STEP 7 전후
        비교의 기준이 될 before_snapshot을 확인해 보세요.
      </p>
      <pre className="json-preview">{JSON.stringify(preview, null, 2)}</pre>
      <div className="screen-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            actions.reset();
            onRestart();
          }}
        >
          처음부터 다시 하기
        </button>
      </div>
    </div>
  );
}
