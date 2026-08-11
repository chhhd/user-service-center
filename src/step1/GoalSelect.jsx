import { FINANCIAL_GOALS } from "../data/financialGoals";
import StepHeader from "../shared/StepHeader";

export default function GoalSelect({ selectedGoalId, onSelect, onBack, onNext }) {
  return (
    <div className="screen">
      <StepHeader step={2} total={3} title="이번 체험에서 확인하고 싶은 목표를 골라 주세요" />
      <p className="screen-desc">선택한 목표는 추천 정책과 금융생활 유형 판정에 함께 사용돼요.</p>

      <div className="card-grid">
        {FINANCIAL_GOALS.map((goal) => {
          const selected = goal.id === selectedGoalId;
          return (
            <button
              key={goal.id}
              type="button"
              className={`select-card${selected ? " select-card--active" : ""}`}
              onClick={() => onSelect(goal.id)}
              aria-pressed={selected}
            >
              <span className="select-card-avatar">{goal.icon}</span>
              <span className="select-card-title">{goal.label}</span>
              <span className="select-card-summary">{goal.description}</span>
            </button>
          );
        })}
      </div>

      <div className="screen-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!selectedGoalId}
          onClick={onNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}
