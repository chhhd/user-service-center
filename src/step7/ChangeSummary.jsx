import { DATA_FIELD_META } from "../shared/dataFieldMeta";

function FieldTagRow({ fieldIds, empty }) {
  if (fieldIds.length === 0) {
    return <p className="hint-text hint-text--muted">{empty}</p>;
  }
  return (
    <div className="tag-row">
      {fieldIds.map((id) => (
        <span key={id} className="tag">
          {DATA_FIELD_META[id]?.label ?? id}
        </span>
      ))}
    </div>
  );
}

function PolicyTagRow({ policies }) {
  if (policies.length === 0) {
    return <p className="hint-text hint-text--muted">없음</p>;
  }
  return (
    <div className="tag-row">
      {policies.map((p) => (
        <span key={p} className="tag">
          {p}
        </span>
      ))}
    </div>
  );
}

// STEP6의 before_snapshot과 STEP7 재계산 결과(comparison)를 나란히 보여준다.
// STEP7에서는 실시간 미리보기로, STEP8에서는 최종 결과표의 일부로 재사용한다.
export default function ChangeSummary({ comparison }) {
  if (!comparison) return null;

  const {
    consent_count_before,
    consent_count_after,
    consent_added,
    consent_removed,
    type_before,
    type_after,
    type_changed,
    type_used_added,
    type_used_removed,
    policies_added,
    policies_removed,
    recommendation_used_count_before,
    recommendation_used_count_after,
    inference_evidence_count_before,
    inference_evidence_count_after,
    risk_score_before,
    risk_score_after,
    risk_score_delta,
    risk_level_before,
    risk_level_after,
  } = comparison;

  const hasTypeUsedDiff = type_used_added.length > 0 || type_used_removed.length > 0;
  const hasPolicyDiff = policies_added.length > 0 || policies_removed.length > 0;

  return (
    <section className="change-summary">
      <h3 className="field-group-title">STEP6 대비 변경 요약</h3>

      <div className="change-row">
        <span className="change-row-label">동의한 정보 수</span>
        <span className="change-row-value">
          {consent_count_before}개 → {consent_count_after}개
        </span>
      </div>

      <div className="change-block">
        <span className="change-block-label">새로 동의한 항목</span>
        <FieldTagRow fieldIds={consent_added} empty="새로 동의한 항목이 없어요." />
      </div>
      <div className="change-block">
        <span className="change-block-label">동의를 철회한 항목</span>
        <FieldTagRow fieldIds={consent_removed} empty="철회한 항목이 없어요." />
      </div>

      <div className="change-row">
        <span className="change-row-label">금융생활 유형</span>
        <span className="change-row-value">
          {type_changed ? `${type_before ?? "-"} → ${type_after}` : `${type_after} (변화 없음)`}
        </span>
      </div>

      {hasTypeUsedDiff && (
        <div className="change-block">
          <span className="change-block-label">유형 판단에 새로 반영된 정보</span>
          <FieldTagRow fieldIds={type_used_added} empty="없음" />
          <span className="change-block-label">유형 판단에서 빠진 정보</span>
          <FieldTagRow fieldIds={type_used_removed} empty="없음" />
        </div>
      )}

      {hasPolicyDiff && (
        <>
          <div className="change-block">
            <span className="change-block-label">새로 매칭된 정책</span>
            <PolicyTagRow policies={policies_added} />
          </div>
          <div className="change-block">
            <span className="change-block-label">더 이상 매칭되지 않는 정책</span>
            <PolicyTagRow policies={policies_removed} />
          </div>
        </>
      )}

      <div className="change-row">
        <span className="change-row-label">추천에 사용된 정보</span>
        <span className="change-row-value">
          {recommendation_used_count_before}개 → {recommendation_used_count_after}개
        </span>
      </div>
      <div className="change-row">
        <span className="change-row-label">추론에 활용될 수 있는 정보</span>
        <span className="change-row-value">
          {inference_evidence_count_before}개 → {inference_evidence_count_after}개
        </span>
      </div>

      <div className="change-row">
        <span className="change-row-label">개인정보 위험도</span>
        <span className="change-row-value">
          {risk_score_before}점({risk_level_before}) → {risk_score_after}점({risk_level_after}){" "}
          <span
            className={`risk-delta${
              risk_score_delta > 0 ? " risk-delta--up" : risk_score_delta < 0 ? " risk-delta--down" : ""
            }`}
          >
            {risk_score_delta > 0 ? `+${risk_score_delta}` : risk_score_delta}
          </span>
        </span>
      </div>
    </section>
  );
}
