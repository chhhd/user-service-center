import { useState } from "react";
import { JourneyProvider } from "./shared/journeyStore";
import Step1Page from "./step1/Step1Page";
import Step2Page from "./step2/Step2Page";
import Step3Page from "./step3/Step3Page";
import Step4Page from "./step4/Step4Page";
import Step5Page from "./step5/Step5Page";
import Step6Page from "./step6/Step6Page";
import Step7Page from "./step7/Step7Page";
import Step8Page from "./step8/Step8Page";
import Step9Page from "./step9/Step9Page";
import "./App.css";

// 구현 범위: STEP1 ~ STEP9 (전체 흐름 완료).
function AppRoutes() {
  const [route, setRoute] = useState("step1"); // "step1" ~ "step9"

  if (route === "step1") {
    return <Step1Page onComplete={() => setRoute("step2")} />;
  }

  if (route === "step2") {
    return <Step2Page onBack={() => setRoute("step1")} onNext={() => setRoute("step3")} />;
  }

  if (route === "step3") {
    return <Step3Page onBack={() => setRoute("step2")} onNext={() => setRoute("step4")} />;
  }

  if (route === "step4") {
    return <Step4Page onBack={() => setRoute("step3")} onNext={() => setRoute("step5")} />;
  }

  if (route === "step5") {
    return <Step5Page onBack={() => setRoute("step4")} onNext={() => setRoute("step6")} />;
  }

  if (route === "step6") {
    return <Step6Page onBack={() => setRoute("step5")} onNext={() => setRoute("step7")} />;
  }

  if (route === "step7") {
    return <Step7Page onBack={() => setRoute("step6")} onNext={() => setRoute("step8")} />;
  }

  if (route === "step8") {
    return <Step8Page onBack={() => setRoute("step7")} onNext={() => setRoute("step9")} />;
  }

  return <Step9Page onRestart={() => setRoute("step1")} />;
}

export default function App() {
  return (
    <JourneyProvider>
      <div className="app-shell">
        <AppRoutes />
      </div>
    </JourneyProvider>
  );
}
