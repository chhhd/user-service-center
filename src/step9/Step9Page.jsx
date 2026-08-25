import StepHeader from "../shared/StepHeader";
import { useJourney } from "../shared/journeyStore";

// STEP9: 체험 종료 화면. journey.result(STEP8에서 저장된 최종 요약)를 읽기만 하고,
// "초기화" 버튼을 누르면 전역 상태를 initialJourney로 되돌려 다음 참가자가 STEP1부터 새로 시작할 수 있게 한다.
export default function Step9Page({ onRestart }) {
  const { journey, actions } = useJourney();
  const { profile, result } = journey;

  function handleRestart() {
    actions.reset();
    onRestart();
  }

  return (
    <div className="screen intro-screen">
      <StepHeader step={9} total={9} title="체험이 끝났어요" />

      <div className="intro-badge">FINCOACH · 체험 종료</div>
      <h1 className="intro-title">
        체험해 주셔서
        <br />
        감사해요{profile ? `, ${profile.name}님` : ""}
      </h1>
      <p className="intro-desc">
        동의 범위에 따라 추천·추론·위험도가 어떻게 달라지는지 직접 확인해 보셨어요.
        <br />
        실제 서비스를 이용할 때도 어떤 정보가 어디에 쓰이는지 한 번 더 확인하는 습관을 가져보세요.
      </p>

      {result && (
        <ul className="intro-points">
          <li>✅ 최종 동의 정보 {result.consented_count}개</li>
          <li>✅ 최종 금융생활 유형 · {result.recommendation_type}</li>
          <li>
            ✅ 최종 개인정보 위험도 · {result.privacy_risk?.score}점 ({result.privacy_risk?.level})
          </li>
        </ul>
      )}

      <button type="button" className="btn btn-primary btn-large" onClick={handleRestart}>
        다음 참가자를 위해 초기화하기
      </button>
    </div>
  );
}
