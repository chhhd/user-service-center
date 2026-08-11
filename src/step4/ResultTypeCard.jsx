export default function ResultTypeCard({ type, messages }) {
  return (
    <section className="result-type-card">
      <span className="result-type-label">금융생활 유형</span>
      <h3 className="result-type-title">{type}</h3>
      <ul className="result-type-messages">
        {messages.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </section>
  );
}
