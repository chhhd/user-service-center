import QuestionCard from "./QuestionCard";

export default function QuestionList({ fieldIds, answers, onSelect }) {
  if (fieldIds.length === 0) return null;

  return (
    <section className="field-group">
      <h3 className="field-group-title">금융생활 정보 입력</h3>
      <p className="field-group-desc">
        동의한 항목만 질문으로 나타나요. 모두 응답해야 다음 단계로 진행할 수 있어요.
      </p>
      <div className="question-list">
        {fieldIds.map((fieldId) => (
          <QuestionCard key={fieldId} fieldId={fieldId} value={answers[fieldId]} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
