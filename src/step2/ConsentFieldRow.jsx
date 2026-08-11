import { DATA_FIELD_META, NECESSITY, NECESSITY_LABEL, SENSITIVITY } from "../shared/dataFieldMeta";

export default function ConsentFieldRow({ fieldId, checked, onToggle }) {
  const meta = DATA_FIELD_META[fieldId];
  const locked = meta.necessity === NECESSITY.REQUIRED;
  const isHigh = meta.sensitivity === SENSITIVITY.HIGH;

  return (
    <label className={`field-row${locked ? " field-row--locked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={locked}
        onChange={() => !locked && onToggle(fieldId)}
      />
      <span className="field-row-body">
        <span className="field-row-top">
          <span className="field-row-label">{meta.label}</span>
          <span className={`badge badge--${meta.necessity}`}>{NECESSITY_LABEL[meta.necessity]}</span>
          {isHigh && <span className="badge badge--sensitive">민감</span>}
        </span>
        <span className="field-row-purpose">{meta.purpose}</span>
      </span>
    </label>
  );
}
