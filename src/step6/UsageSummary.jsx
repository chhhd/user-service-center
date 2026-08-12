import { useState } from "react";
import { DATA_FIELD_META } from "../shared/dataFieldMeta";

// 목적별 정보 개수 요약. 숫자만 보면 어떤 정보가 불필요했는지 알기 어려우므로
// 행을 누르면 해당하는 항목명을 펼쳐서 보여준다.
function SummaryRow({ label, fields }) {
  const [open, setOpen] = useState(false);
  const count = fields.length;

  return (
    <div className="usage-summary-row">
      <button
        type="button"
        className="usage-summary-head"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        disabled={count === 0}
      >
        <span className="usage-summary-label">{label}</span>
        <span className="usage-summary-count">{count}개</span>
      </button>
      {open && count > 0 && (
        <div className="tag-row usage-summary-fields">
          {fields.map((fieldId) => (
            <span key={fieldId} className="tag">
              {DATA_FIELD_META[fieldId]?.label ?? fieldId}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UsageSummary({ report }) {
  const rows = [
    { label: "총 동의한 정보", fields: report.consented_fields },
    { label: "금융 추천에 실제 활용된 정보", fields: report.recommendation_used_fields },
    { label: "추천에 필요하지 않았던 정보", fields: report.recommendation_unused_fields },
    { label: "생활환경 추론에 활용될 수 있는 정보", fields: report.inference_evidence_fields },
    { label: "제3자 제공에 동의한 정보", fields: report.third_party_fields },
    { label: "장기 보관에 동의한 정보", fields: report.long_term_fields },
  ];

  return (
    <section className="usage-summary">
      {rows.map((row) => (
        <SummaryRow key={row.label} label={row.label} fields={row.fields} />
      ))}
    </section>
  );
}
