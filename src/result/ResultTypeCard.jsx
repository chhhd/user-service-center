const STICKER_COLOR_LABEL = {
  red: "빨강",
  orange: "주황",
  green: "초록",
  blue: "파랑",
};

// STEP8(최종 결과표)과 STEP9(부스 마무리)에서 함께 쓰는 최종 유형 카드.
// showStickerNote는 STEP9에서만 켜서 운영진에게 전달할 스티커 색상을 안내한다.
export default function ResultTypeCard({ resultType, showStickerNote = false }) {
  return (
    <section className={`result-quadrant-card result-quadrant-card--${resultType.id}`}>
      <span className="result-type-label">최종 유형</span>
      <h3 className="result-type-title">{resultType.type}</h3>
      <p className="result-quadrant-message">{resultType.message}</p>
      {showStickerNote && (
        <p className="hint-text hint-text--muted">
          운영진 안내: {STICKER_COLOR_LABEL[resultType.sticker_color] ?? resultType.sticker_color} 스티커를
          전달해주세요.
        </p>
      )}
    </section>
  );
}
