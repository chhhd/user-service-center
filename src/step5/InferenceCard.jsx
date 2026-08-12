import { useState } from "react";
import { DATA_FIELD_META } from "../shared/dataFieldMeta";
import { RISK_LEVEL_LABEL } from "./inferenceRules";

// 추론 결과 1건 카드: 제목, 가능성 추정 문구, 근거 정보 태그, 결합 정도, 위험 등급.
// "왜 문제가 되나요?"를 누르면 이 추론이 문제가 될 수 있는 이유를 펼친다.
export default function InferenceCard({ inference }) {
  const [showReason, setShowReason] = useState(false);
  const { title, message, risk_level, risk_explanation, evidence_fields, combination_label } =
    inference;

  return (
    <div className={`inference-card inference-card--${risk_level}`}>
      <div className="inference-card-head">
        <h3 className="inference-card-title">{title}</h3>
        <span className={`risk-badge risk-badge--${risk_level}`}>
          위험 {RISK_LEVEL_LABEL[risk_level]}
        </span>
      </div>

      <p className="inference-card-message">{message}</p>

      <div className="inference-card-evidence">
        <span className="inference-card-evidence-label">근거 정보</span>
        <div className="tag-row">
          {evidence_fields.map((fieldId) => (
            <span key={fieldId} className="tag">
              {DATA_FIELD_META[fieldId].label}
            </span>
          ))}
        </div>
        <span className="inference-card-combination">{combination_label}</span>
      </div>

      <button
        type="button"
        className="inference-card-reason-toggle"
        aria-expanded={showReason}
        onClick={() => setShowReason((prev) => !prev)}
      >
        {showReason ? "설명 접기" : "왜 문제가 될 수 있나요?"}
      </button>
      {showReason && <p className="inference-card-reason">{risk_explanation}</p>}
    </div>
  );
}
