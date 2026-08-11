import ConsentFieldRow from "./ConsentFieldRow";
import { FIELD_CATEGORY_LABEL, getFieldsByCategory } from "../shared/dataFieldMeta";

const CATEGORY_DESC = {
  basic: "정책 추천의 기본 조건이 되는 정보예요.",
  financial: "금융생활 유형을 분석하는 데 사용되는 정보예요.",
  sensitive: "추천에는 필요하지 않지만, 제공할수록 AI가 더 많은 것을 추론할 수 있어요.",
};

export default function FieldConsentGroup({ category, consent, onToggle }) {
  const fieldIds = getFieldsByCategory(category);

  return (
    <section className="field-group">
      <h3 className="field-group-title">{FIELD_CATEGORY_LABEL[category]}</h3>
      <p className="field-group-desc">{CATEGORY_DESC[category]}</p>
      <div className="field-group-list">
        {fieldIds.map((fieldId) => (
          <ConsentFieldRow
            key={fieldId}
            fieldId={fieldId}
            checked={consent[fieldId] === true}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
