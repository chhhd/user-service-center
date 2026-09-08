import { useEffect, useMemo } from "react";
import StepHeader from "../shared/StepHeader";
import ResultTypeCard from "./ResultTypeCard";
import PolicyList from "./PolicyList";
import { recommend } from "./recommend";
import { useJourney } from "../shared/journeyStore";

// STEP4 처리 순서: 동의 + 실제 값이 있는 항목으로 유형 판정 -> 정책 매칭 -> used/unused_fields 계산.
// recommend()는 answers만 받는 순수 함수이며, 결과(recommendation, type_rule)는
// STEP5~8에서 재사용할 수 있도록 journey 전역 상태에 저장한다.
export default function Step4Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { answers } = journey;

  const result = useMemo(() => recommend({ answers }), [answers]);

  useEffect(() => {
    actions.setRecommendation(result.recommendation, result.type_rule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const { recommendation } = result;

  return (
    <div className="screen">
      <StepHeader step={4} total={9} title="금융·청년정책 추천 결과" />
      <p className="screen-desc">
        STEP3에서 동의하고 입력한 정보를 바탕으로 금융생활 유형과 청년정책을 추천해요.
      </p>

      <ResultTypeCard type={recommendation.type} messages={recommendation.messages} />
      <PolicyList policies={recommendation.policies} />

      <div className="screen-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          이전
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          다음
        </button>
      </div>
    </div>
  );
}
