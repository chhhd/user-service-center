import { PROFILES } from "../data/profiles";
import StepHeader from "../shared/StepHeader";

export default function ProfileSelect({ selectedProfileId, onSelect, onBack, onNext }) {
  return (
    <div className="screen">
      <StepHeader step={1} total={3} title="가상 프로필을 선택해 주세요" />
      <p className="screen-desc">
        아래 4개의 가상 청년 프로필 중 하나를 골라 체험을 시작해요. 실제 나의 정보가 아니에요.
      </p>

      <div className="card-grid">
        {PROFILES.map((profile) => {
          const selected = profile.id === selectedProfileId;
          return (
            <button
              key={profile.id}
              type="button"
              className={`select-card${selected ? " select-card--active" : ""}`}
              onClick={() => onSelect(profile.id)}
              aria-pressed={selected}
            >
              <span className="select-card-avatar">{profile.avatar}</span>
              <span className="select-card-title">{profile.name}</span>
              <span className="select-card-summary">{profile.summary}</span>
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
          disabled={!selectedProfileId}
          onClick={onNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}
