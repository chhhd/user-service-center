import { useState } from "react";
import { JourneyProvider } from "./shared/journeyStore";
import Step1Page from "./step1/Step1Page";
import Step2Page from "./step2/Step2Page";
import Step3Page from "./step3/Step3Page";
import Step4Page from "./step4/Step4Page";
import JourneyPreview from "./shared/JourneyPreview";
import "./App.css";

// 현재 구현 범위: STEP1 ~ STEP4. STEP5 이후는 순차적으로 추가될 예정.
function AppRoutes() {
  const [route, setRoute] = useState("step1"); // "step1" | "step2" | "step3" | "step4" | "preview"

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
    return <Step4Page onBack={() => setRoute("step3")} onNext={() => setRoute("preview")} />;
  }

  return <JourneyPreview onRestart={() => setRoute("step1")} />;
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
