// STEP8: 가로축 추천 활용도 / 세로축 개인정보 위험도 사분면에 수정 전·후 점을 찍고 화살표로 연결한다.

const PADDING = 24;
const SIZE = 300;
const PLOT = SIZE - PADDING * 2;

function toXY(utility, risk) {
  const x = PADDING + (Math.max(0, Math.min(100, utility)) / 100) * PLOT;
  const y = PADDING + PLOT - (Math.max(0, Math.min(100, risk)) / 100) * PLOT;
  return { x, y };
}

export default function QuadrantChart({ before, after }) {
  const beforePt = toXY(before.utility_score, before.risk_score);
  const afterPt = toXY(after.utility_score, after.risk_score);
  const mid = PADDING + PLOT / 2;

  return (
    <section className="quadrant-chart">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="quadrant-chart-svg" role="img" aria-label="위험도-활용도 사분면 그래프">
        <rect x={PADDING} y={PADDING} width={PLOT} height={PLOT} className="quadrant-bg" />
        <line x1={PADDING} y1={mid} x2={PADDING + PLOT} y2={mid} className="quadrant-gridline" />
        <line x1={mid} y1={PADDING} x2={mid} y2={PADDING + PLOT} className="quadrant-gridline" />

        <line x1={PADDING} y1={PADDING + PLOT} x2={PADDING + PLOT} y2={PADDING + PLOT} className="quadrant-axis" />
        <line x1={PADDING} y1={PADDING} x2={PADDING} y2={PADDING + PLOT} className="quadrant-axis" />

        <defs>
          <marker id="quadrant-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="quadrant-arrowhead" />
          </marker>
        </defs>

        {(beforePt.x !== afterPt.x || beforePt.y !== afterPt.y) && (
          <line
            x1={beforePt.x}
            y1={beforePt.y}
            x2={afterPt.x}
            y2={afterPt.y}
            className="quadrant-arrow"
            markerEnd="url(#quadrant-arrowhead)"
          />
        )}

        <circle cx={beforePt.x} cy={beforePt.y} r="7" className="quadrant-point quadrant-point--before" />
        <circle cx={afterPt.x} cy={afterPt.y} r="7" className="quadrant-point quadrant-point--after" />
      </svg>

      <div className="quadrant-chart-legend">
        <span>
          <span className="quadrant-dot quadrant-dot--before" /> 수정 전 (활용도 {before.utility_score}점 ·
          위험도 {before.risk_score}점)
        </span>
        <span>
          <span className="quadrant-dot quadrant-dot--after" /> 수정 후 (활용도 {after.utility_score}점 ·
          위험도 {after.risk_score}점)
        </span>
      </div>
      <div className="quadrant-chart-axis-labels">
        <span>가로축: 추천 활용도 →</span>
        <span>세로축: 개인정보 위험도 ↑</span>
      </div>
    </section>
  );
}
