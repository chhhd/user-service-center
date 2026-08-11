export default function IntroScreen({ onStart }) {
  return (
    <div className="screen intro-screen">
      <div className="intro-badge">FINCOACH · 가상 체험</div>
      <h1 className="intro-title">
        나에게 맞는 금융·청년정책,
        <br />
        AI 코치가 찾아드려요
      </h1>
      <p className="intro-desc">
        가상의 프로필로 체험하는 금융 코치 서비스예요.
        <br />
        실제 개인정보는 입력하지 않으며, 모든 데이터는 이 화면을 벗어나면 사라져요.
      </p>
      <ul className="intro-points">
        <li>✅ 실제 정보 입력 없음 · 가상 프로필로만 진행</li>
        <li>✅ 서버 전송 없음 · 브라우저 메모리에서만 계산</li>
        <li>✅ 동의 범위에 따라 추천·추론 결과가 달라지는 과정을 직접 체험</li>
      </ul>
      <button type="button" className="btn btn-primary btn-large" onClick={onStart}>
        시작하기
      </button>
    </div>
  );
}
