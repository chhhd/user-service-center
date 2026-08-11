import { DATA_FIELD_META } from "../shared/dataFieldMeta";
import { THIRD_PARTY_OPTION, RETENTION_PERIOD } from "../shared/journeyStore";

const THIRD_PARTY_OPTIONS = [
  { id: THIRD_PARTY_OPTION.NONE, label: "미동의" },
  { id: THIRD_PARTY_OPTION.AGREED_CHECKED, label: "제공 항목 확인 후 동의" },
  { id: THIRD_PARTY_OPTION.AGREED_UNCHECKED, label: "확인하지 않고 동의" },
];

const RETENTION_OPTIONS = [
  { id: RETENTION_PERIOD.DELETE_AFTER_EXPERIENCE, label: "체험 종료 후 삭제" },
  { id: RETENTION_PERIOD.DAYS_30, label: "30일" },
  { id: RETENTION_PERIOD.UNLIMITED, label: "무기한" },
];

function getThirdPartyOption(dataControls) {
  if (!dataControls.third_party_agreed) return THIRD_PARTY_OPTION.NONE;
  return dataControls.third_party_notice_checked
    ? THIRD_PARTY_OPTION.AGREED_CHECKED
    : THIRD_PARTY_OPTION.AGREED_UNCHECKED;
}

export default function DataControlsPanel({
  consentedFieldIds,
  dataControls,
  onSetThirdPartyOption,
  onToggleThirdPartyField,
  onSetRetentionPeriod,
}) {
  const currentThirdPartyOption = getThirdPartyOption(dataControls);

  return (
    <section className="data-controls">
      <div className="data-controls-block">
        <h3 className="field-group-title">제3자 제공</h3>
        <p className="field-group-desc">
          동의한 정보 중 일부를 제휴 서비스에 제공하는 상황을 가정해요.
        </p>
        <div className="radio-row">
          {THIRD_PARTY_OPTIONS.map((opt) => (
            <label key={opt.id} className="radio-pill">
              <input
                type="radio"
                name="third_party_option"
                checked={currentThirdPartyOption === opt.id}
                onChange={() => onSetThirdPartyOption(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        {dataControls.third_party_agreed && (
          <div className="third-party-field-picker">
            <p className="hint-text">제3자에게 제공할 항목을 선택해 주세요.</p>
            {consentedFieldIds.length === 0 && (
              <p className="hint-text hint-text--muted">동의한 항목이 없어요.</p>
            )}
            <div className="chip-row">
              {consentedFieldIds.map((fieldId) => {
                const selected = dataControls.third_party_fields.includes(fieldId);
                return (
                  <button
                    type="button"
                    key={fieldId}
                    className={`chip${selected ? " chip--active" : ""}`}
                    onClick={() => onToggleThirdPartyField(fieldId)}
                  >
                    {DATA_FIELD_META[fieldId].label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="data-controls-block">
        <h3 className="field-group-title">보관 기간</h3>
        <p className="field-group-desc">
          체험 종료 후 삭제가 아니라면, 현재 동의한 정보 전체가 보관 대상이 돼요.
        </p>
        <div className="radio-row">
          {RETENTION_OPTIONS.map((opt) => (
            <label key={opt.id} className="radio-pill">
              <input
                type="radio"
                name="retention_period"
                checked={dataControls.retention_period === opt.id}
                onChange={() => onSetRetentionPeriod(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {dataControls.retention_period &&
          dataControls.retention_period !== RETENTION_PERIOD.DELETE_AFTER_EXPERIENCE && (
            <p className="hint-text">
              현재 동의한 {dataControls.retention_fields.length}개 항목이 보관 대상에 포함돼요.
            </p>
          )}
      </div>
    </section>
  );
}
