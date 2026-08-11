export default function PolicyList({ policies }) {
  return (
    <section className="field-group">
      <h3 className="field-group-title">매칭된 금융·청년정책</h3>
      {policies.length === 0 ? (
        <p className="hint-text hint-text--muted">현재 답변으로 매칭된 정책이 없어요.</p>
      ) : (
        <div className="policy-list">
          {policies.map(({ policy, description }) => (
            <div key={policy} className="policy-card">
              <span className="policy-card-title">🏛️ {policy}</span>
              {description && <p className="policy-card-desc">{description}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
