const MODES = [
  {
    id: "full",
    label: "전체 동의",
    desc: "모든 항목에 동의하고 가장 풍부한 추천을 받아요.",
  },
  {
    id: "custom",
    label: "맞춤 동의",
    desc: "항목을 하나씩 직접 선택해요.",
  },
  {
    id: "minimal",
    label: "최소 동의",
    desc: "기본 필요 항목과 목표에 꼭 필요한 항목만 동의해요.",
  },
];

export default function ConsentModeSelect({ mode, onSelect }) {
  return (
    <div className="consent-mode-select">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          className={`consent-mode-btn${mode === m.id ? " consent-mode-btn--active" : ""}`}
          onClick={() => onSelect(m.id)}
        >
          <span className="consent-mode-btn-label">{m.label}</span>
          <span className="consent-mode-btn-desc">{m.desc}</span>
        </button>
      ))}
    </div>
  );
}
