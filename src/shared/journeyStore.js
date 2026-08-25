import { createContext, createElement, useContext, useMemo, useReducer } from "react";
import { getConsentedFieldIds, computeFullConsent, computeMinimalConsent } from "./consentRules";

// 참가자 1명의 체험 전체를 담는 공통 상태. STEP1~STEP9가 이 구조 하나만 사용한다.
export const initialJourney = {
  profile: null,
  goal: null,

  consent_mode: null,
  consent: {},
  data_controls: {
    third_party_agreed: false,
    third_party_notice_checked: false,
    third_party_fields: [],
    retention_period: null,
    retention_fields: [],
  },

  answers: {},
  recommendation: null,
  type_rule: null,
  inference: null,
  inference_feedback: null,
  usage_report: null,
  privacy_risk: null,

  before_snapshot: null,
  comparison: null,
  edited: false,
  result: null,
};

export const THIRD_PARTY_OPTION = {
  NONE: "none", // 미동의
  AGREED_CHECKED: "agreed_checked", // 제공 항목 확인 후 동의
  AGREED_UNCHECKED: "agreed_unchecked", // 확인하지 않고 동의
};

export const RETENTION_PERIOD = {
  DELETE_AFTER_EXPERIENCE: "delete_after_experience",
  DAYS_30: "30_days",
  UNLIMITED: "unlimited",
};

/** 동의가 해제된 필드는 제3자 제공/보관 목록에서 즉시 제거하고,
 *  보관기간이 정해져 있으면 현재 동의된 필드 전체를 보관 목록으로 동기화한다. */
function syncDataControls(consent, dataControls) {
  const consentedIds = new Set(getConsentedFieldIds(consent));

  const third_party_fields = (dataControls.third_party_fields ?? []).filter((id) =>
    consentedIds.has(id)
  );

  const retention_fields =
    dataControls.retention_period == null ||
    dataControls.retention_period === RETENTION_PERIOD.DELETE_AFTER_EXPERIENCE
      ? []
      : [...consentedIds];

  return {
    ...dataControls,
    third_party_fields,
    retention_fields,
  };
}

function journeyReducer(state, action) {
  switch (action.type) {
    case "SET_PROFILE": {
      return { ...state, profile: action.profile };
    }

    case "SET_GOAL": {
      return { ...state, goal: action.goal };
    }

    case "SET_CONSENT_MODE": {
      const { mode } = action;
      let consent = state.consent;
      if (mode === "full") {
        consent = computeFullConsent();
      } else if (mode === "minimal") {
        consent = computeMinimalConsent(state.goal);
      }
      // custom: 기존 선택을 그대로 유지한 채 모드만 전환
      return {
        ...state,
        consent_mode: mode,
        consent,
        data_controls: syncDataControls(consent, state.data_controls),
      };
    }

    case "TOGGLE_FIELD_CONSENT": {
      const { fieldId } = action;
      const consent = { ...state.consent, [fieldId]: !state.consent[fieldId] };
      // 전체/최소 동의 상태에서 개별 항목을 직접 해제·추가하면 맞춤 동의로 전환한다.
      const consent_mode =
        state.consent_mode === "full" || state.consent_mode === "minimal"
          ? "custom"
          : state.consent_mode;
      return {
        ...state,
        consent,
        consent_mode,
        data_controls: syncDataControls(consent, state.data_controls),
      };
    }

    case "SET_THIRD_PARTY_OPTION": {
      const { option } = action;
      const third_party_agreed = option !== THIRD_PARTY_OPTION.NONE;
      const third_party_notice_checked = option === THIRD_PARTY_OPTION.AGREED_CHECKED;
      const nextControls = {
        ...state.data_controls,
        third_party_agreed,
        third_party_notice_checked,
        third_party_fields: third_party_agreed ? state.data_controls.third_party_fields : [],
      };
      return {
        ...state,
        data_controls: syncDataControls(state.consent, nextControls),
      };
    }

    case "TOGGLE_THIRD_PARTY_FIELD": {
      const { fieldId } = action;
      if (!state.data_controls.third_party_agreed) return state;
      if (state.consent[fieldId] !== true) return state;
      const current = state.data_controls.third_party_fields;
      const third_party_fields = current.includes(fieldId)
        ? current.filter((id) => id !== fieldId)
        : [...current, fieldId];
      return {
        ...state,
        data_controls: { ...state.data_controls, third_party_fields },
      };
    }

    case "SET_RETENTION_PERIOD": {
      const nextControls = {
        ...state.data_controls,
        retention_period: action.period,
      };
      return {
        ...state,
        data_controls: syncDataControls(state.consent, nextControls),
      };
    }

    case "SET_ANSWERS": {
      // STEP3/STEP7이 매번 QUESTION_FIELD_IDS 전체를 다시 계산해 넘기므로 병합하지 않고 통째로 교체한다.
      return { ...state, answers: { ...action.answers } };
    }

    case "SET_RECOMMENDATION": {
      return { ...state, recommendation: action.recommendation, type_rule: action.type_rule };
    }

    case "SET_INFERENCE": {
      return { ...state, inference: action.inference };
    }

    case "SET_INFERENCE_FEEDBACK": {
      return { ...state, inference_feedback: action.feedback };
    }

    case "COMPLETE_STEP6": {
      const { usage_report, privacy_risk } = action;
      // 전후 비교 기준이 되는 스냅샷은 STEP6 진입 시 1회만 만들고 이후 덮어쓰지 않는다.
      const before_snapshot = state.before_snapshot ?? {
        consent: { ...state.consent },
        data_controls: { ...state.data_controls },
        usage_report,
        privacy_risk,
        recommendation_signature: {
          type: state.recommendation?.type ?? null,
          policies: (state.recommendation?.policies ?? []).map((p) => p.policy),
        },
        // STEP7 활용도 재계산에 유형 판단 근거가 필요해 used_fields도 함께 담는다.
        type_rule: {
          used_fields: state.type_rule?.used_fields ?? [],
        },
      };
      return { ...state, usage_report, privacy_risk, before_snapshot };
    }

    case "COMPLETE_STEP7": {
      const { answers, recommendation, type_rule, inference, usage_report, privacy_risk, comparison } =
        action;
      // STEP7에서 동의를 다시 선택하고 재계산한 결과로 전역 상태를 갱신한다.
      // before_snapshot(STEP6)은 건드리지 않아 전후 비교 기준으로 계속 남는다.
      // 개발 파이프라인 문서(recalculateJourney) 스펙에 따라 STEP7을 완료하면 edited는 항상 true —
      // "실제로 값이 바뀌었는지"는 comparison(전후 type/policies 비교)으로 판단하고, edited 자체는
      // "STEP7을 거쳐갔는지"를 나타낸다.
      return {
        ...state,
        answers,
        recommendation,
        type_rule,
        inference,
        usage_report,
        privacy_risk,
        comparison,
        edited: true,
      };
    }

    case "COMPLETE_STEP8": {
      return { ...state, result: action.result };
    }

    case "RESET": {
      return { ...initialJourney };
    }

    default:
      return state;
  }
}

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
  const [journey, dispatch] = useReducer(journeyReducer, initialJourney);

  const actions = useMemo(
    () => ({
      setProfile: (profile) => dispatch({ type: "SET_PROFILE", profile }),
      setGoal: (goal) => dispatch({ type: "SET_GOAL", goal }),
      setConsentMode: (mode) => dispatch({ type: "SET_CONSENT_MODE", mode }),
      toggleFieldConsent: (fieldId) => dispatch({ type: "TOGGLE_FIELD_CONSENT", fieldId }),
      setThirdPartyOption: (option) => dispatch({ type: "SET_THIRD_PARTY_OPTION", option }),
      toggleThirdPartyField: (fieldId) => dispatch({ type: "TOGGLE_THIRD_PARTY_FIELD", fieldId }),
      setRetentionPeriod: (period) => dispatch({ type: "SET_RETENTION_PERIOD", period }),
      setAnswers: (answers) => dispatch({ type: "SET_ANSWERS", answers }),
      setRecommendation: (recommendation, type_rule) =>
        dispatch({ type: "SET_RECOMMENDATION", recommendation, type_rule }),
      setInference: (inference) => dispatch({ type: "SET_INFERENCE", inference }),
      setInferenceFeedback: (feedback) =>
        dispatch({ type: "SET_INFERENCE_FEEDBACK", feedback }),
      completeStep6: (usage_report, privacy_risk) =>
        dispatch({ type: "COMPLETE_STEP6", usage_report, privacy_risk }),
      completeStep7: (payload) => dispatch({ type: "COMPLETE_STEP7", ...payload }),
      completeStep8: (result) => dispatch({ type: "COMPLETE_STEP8", result }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  const value = useMemo(() => ({ journey, dispatch, actions }), [journey, actions]);

  return createElement(JourneyContext.Provider, { value }, children);
}

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error("useJourney must be used within a JourneyProvider");
  return ctx;
}
