import { DATA_FIELD_META } from "../shared/dataFieldMeta";
import { QUESTION_OPTIONS } from "./questionOptions";

export default function QuestionCard({ fieldId, value, onSelect }) {
  const meta = DATA_FIELD_META[fieldId];
  const options = QUESTION_OPTIONS[fieldId] ?? [];

  return (
    <div className="question-card">
      <span className="question-card-label">
        {meta.label}
        <span className="question-card-required">필수</span>
      </span>
      <div className="option-pills">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={`option-pill${value === opt ? " option-pill--active" : ""}`}
            onClick={() => onSelect(fieldId, opt)}
            aria-pressed={value === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
