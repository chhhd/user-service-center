import { DATA_FIELD_META } from "../shared/dataFieldMeta";

// 목적별 정보 흐름 시각화.
// 왼쪽(동의한 정보) -> 가운데(MY:D 청년) -> 오른쪽(제휴·광고, 장기 보관).
// 실제 선택값에 따라 각 정보의 흐름(추천 사용 / 추론만 / 미사용)을 색으로 구분하고,
// 제공 대상이 없는 노드는 비활성화해 항상 데이터가 퍼지는 그림으로 왜곡되지 않게 한다.

function getFlowKind(fieldId, report) {
  if (report.recommendation_used_fields.includes(fieldId)) return "recommendation";
  if (report.inference_evidence_fields.includes(fieldId)) return "inference";
  return "unused";
}

const FLOW_LABEL = {
  recommendation: "추천에 사용",
  inference: "추론에만 활용 가능",
  unused: "추천에 미사용",
};

export default function DataFlowGraph({ report }) {
  const { consented_fields, third_party_fields, long_term_fields } = report;
  const hasThirdParty = third_party_fields.length > 0;
  const hasLongTerm = long_term_fields.length > 0;

  return (
    <section className="flow-graph">
      <div className="flow-col flow-col--source">
        <span className="flow-col-title">동의한 정보 {consented_fields.length}개</span>
        <div className="flow-chip-list">
          {consented_fields.map((fieldId) => {
            const kind = getFlowKind(fieldId, report);
            return (
              <span key={fieldId} className={`flow-chip flow-chip--${kind}`}>
                {DATA_FIELD_META[fieldId].label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flow-col flow-col--hub">
        <div className="flow-node flow-node--hub">
          <span className="flow-node-title">MY:D 청년</span>
          <span className="flow-node-count"> {report.recommendation_used_count}개 사용</span>
        </div>
      </div>

      <div className="flow-col flow-col--dest">
        <div className={`flow-node${hasThirdParty ? "" : " flow-node--off"}`}>
          <span className="flow-node-title">제휴 금융사·광고회사</span>
          <span className="flow-node-count">
            {hasThirdParty ? ` 제3자 제공 ${third_party_fields.length}개` : " 제공 없음"}
          </span>
        </div>
        <div className={`flow-node${hasLongTerm ? "" : " flow-node--off"}`}>
          <span className="flow-node-title">장기 보관 저장소</span>
          <span className="flow-node-count">
            {hasLongTerm ? ` 보관 대상 ${long_term_fields.length}개` : " 보관 없음"}
          </span>
        </div>
      </div>

      <ul className="flow-legend">
        <li>
          <span className="flow-dot flow-dot--recommendation" />
          {FLOW_LABEL.recommendation}
        </li>
        <li>
          <span className="flow-dot flow-dot--inference" />
          {FLOW_LABEL.inference}
        </li>
        <li>
          <span className="flow-dot flow-dot--unused" />
          {FLOW_LABEL.unused}
        </li>
      </ul>
    </section>
  );
}
