import { useEffect, useRef, useState } from "react";

// STEP9 부스 마무리 화면의 무입력 자동 초기화 훅.
// idleTimeoutMs 동안 조작(pointerdown/keydown/touchstart)이 없으면 onIdle을 호출하고,
// 그 직전 warningLeadMs 동안은 showWarning이 true가 된다. 조작이 발생하면 타이머를 처음부터
// 다시 시작한다 (경고도 취소된다).
export function useIdleReset({ idleTimeoutMs, warningLeadMs, onIdle }) {
  const [showWarning, setShowWarning] = useState(false);
  const warningTimerRef = useRef(null);
  const resetTimerRef = useRef(null);
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    function clearTimers() {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    }

    function scheduleTimers() {
      clearTimers();
      setShowWarning(false);
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
      }, Math.max(0, idleTimeoutMs - warningLeadMs));
      resetTimerRef.current = setTimeout(() => {
        onIdleRef.current();
      }, idleTimeoutMs);
    }

    scheduleTimers();

    function handleActivity() {
      scheduleTimers();
    }

    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((evt) => window.addEventListener(evt, handleActivity));

    return () => {
      clearTimers();
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
    };
  }, [idleTimeoutMs, warningLeadMs]);

  return { showWarning };
}
