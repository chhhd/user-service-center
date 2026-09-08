import { useEffect, useMemo } from "react";
import StepHeader from "../shared/StepHeader";
import InferenceCard from "./InferenceCard";
import { buildInferenceContext } from "./buildInferenceContext";
import { buildInference } from "./evaluateInferences";
import { useJourney } from "../shared/journeyStore";

const MAX_VISIBLE = 5;

const FEEDBACK_OPTIONS = [
  { id: "similar", label: "꽤 비슷해요" },
  { id: "partly", label: "일부만 맞아요" },
  { id: "different", label: "거의 다르다고 느껴요" },
];

// STEP5: 같은 정보가 금융 추천 외에 어떤 생활환경·경제 상황을 추론하는 데 쓰일 수 있는지 보여준다.
// buildInference 결과는 STEP6 리포트 집계에 재사용하므로 journey 전역 상태에 저장한다.
export default function Step5Page({ onBack, onNext }) {
  const { journey, actions } = useJourney();
  const { profile, consent, answers, recommendation, inference_feedback } = journey;

  const inference = useMemo(() => {
    const context = buildInferenceContext({ profile, consent, answers });
    return buildInference(context);
  }, [profile, consent, answers]);

  useEffect(() => {
    actions.setInference(inference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inference]);

  const visibleInferences = inference.inferences.slice(0, MAX_VISIBLE);
  const hiddenCount = inference.inference_count - visibleInferences.length;
  const recommendationUsedCount = recommendation?.used_count ?? 0;
  const inferenceCount = inference.inference_evidence_field_count;
  const inferenceExceedsRecommendation = inferenceCount > recommendationUsedCount;

  return (
    <div className="screen">
      <StepHeader step={5} total={9} title="AI 개인정보 추론 결과" />

      <div className="notice-banner">
        <strong>잠깐, 금융 추천은 끝났지만 더 중요한 사실이 있어요.</strong>
        <p>
          제공한 정보는 금융 혜택을 찾는 데만 쓰이는 것이 아니라, 생활환경과 경제 상황을 추정하는 데도
          활용될 수 있어요.
        </p>
      </div>

      <p className="contrast-line">
        추천에는 <strong>{recommendationUsedCount}개</strong>의 정보가 쓰였지만, 당신을 설명하는 추론에는{" "}
        <strong>{inferenceCount}개</strong>의 정보가 활용될 수 있어요.
      </p>

      {inference.inference_count === 0 ? (
        <p className="hint-text hint-text--muted">
          현재 동의한 정보 조합으로는 성립하는 추론이 없어요. 정보를 더 제공할수록 추론 가능성은 늘어나요.
        </p>
      ) : (
        <div className="inference-list">
          {visibleInferences.map((item) => (
            <InferenceCard key={item.id} inference={item} />
          ))}
          {hiddenCount > 0 && (
            <p className="hint-text hint-text--muted">
              이 밖에도 {hiddenCount}개의 추론이 더 가능하지만, 위험도가 높은 순으로 {MAX_VISIBLE}개만
              보여주고 있어요.
            </p>
          )}
        </div>
      )}

      {inferenceExceedsRecommendation && (
        <p className="screen-desc">
          같은 선택으로 당신을 설명할 수 있는 정보가 추천에 쓰인 정보보다 많아요. 다음 화면에서 정보가
          실제로 어디에 쓰이는지 확인해 보세요.
        </p>
      )}

      <section className="feedback-block">
        <span className="feedback-block-label">이 추론들이 실제 나와 얼마나 비슷한가요?</span>
        <div className="radio-row">
          {FEEDBACK_OPTIONS.map((opt) => (
            <label key={opt.id} className="radio-pill">
              <input
                type="radio"
                name="inference_feedback"
                checked={inference_feedback === opt.id}
                onChange={() => actions.setInferenceFeedback(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <p className="hint-text hint-text--muted">응답은 화면 확인용이며 어디에도 저장되지 않아요.</p>
      </section>

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
