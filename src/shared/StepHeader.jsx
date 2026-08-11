export default function StepHeader({ step, total, title }) {
  return (
    <div className="step-header">
      <span className="step-header-count">
        {step} / {total}
      </span>
      <h2 className="step-header-title">{title}</h2>
    </div>
  );
}
