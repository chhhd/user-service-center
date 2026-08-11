import { DATA_FIELD_META } from "../shared/dataFieldMeta";
import { QUESTION_OPTIONS } from "./questionOptions";

// input_source === PROFILE 인 필드(연령대/직업 상태/거주 지역)는 STEP1 프로필 값을 그대로 사용하고,
// 여기서는 옵션 중 프로필 값만 체크 표시된 읽기 전용 상태로 보여준다 (수정 불가).
export default function LockedFieldGroup({ fieldIds, profile }) {
  if (fieldIds.length === 0) return null;

  return (
    <section className="field-group">
      <h3 className="field-group-title">프로필에서 가져온 정보</h3>
      <p className="field-group-desc">
        STEP1에서 선택한 가상 프로필의 값이 그대로 사용돼요. 이 화면에서는 수정할 수 없어요.
      </p>
      <div className="question-list">
        {fieldIds.map((fieldId) => {
          const meta = DATA_FIELD_META[fieldId];
          const value = profile.base_data[fieldId];
          const options = QUESTION_OPTIONS[fieldId] ?? [];
          return (
            <div key={fieldId} className="question-card question-card--locked">
              <span className="question-card-label">{meta.label}</span>
              <div className="option-pills">
                {options.map((opt) => (
                  <span
                    key={opt}
                    className={`option-pill option-pill--locked${
                      opt === value ? " option-pill--active" : ""
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
