import { useState } from "react";
import IntroScreen from "./IntroScreen";
import ProfileSelect from "./ProfileSelect";
import GoalSelect from "./GoalSelect";
import { PROFILES } from "../data/profiles";
import { useJourney } from "../shared/journeyStore";

// STEP1 화면 순서: 소개 -> 프로필 선택 -> 목표 선택 -> STEP2
export default function Step1Page({ onComplete }) {
  const { journey, actions } = useJourney();
  const [screen, setScreen] = useState("intro"); // "intro" | "profile" | "goal"
  const [profileId, setProfileId] = useState(journey.profile?.id ?? null);
  const [goalId, setGoalId] = useState(journey.goal ?? null);

  function handleFinish() {
    const profile = PROFILES.find((p) => p.id === profileId) ?? null;
    actions.setProfile(profile);
    actions.setGoal(goalId);
    onComplete();
  }

  if (screen === "intro") {
    return <IntroScreen onStart={() => setScreen("profile")} />;
  }

  if (screen === "profile") {
    return (
      <ProfileSelect
        selectedProfileId={profileId}
        onSelect={setProfileId}
        onBack={() => setScreen("intro")}
        onNext={() => setScreen("goal")}
      />
    );
  }

  return (
    <GoalSelect
      selectedGoalId={goalId}
      onSelect={setGoalId}
      onBack={() => setScreen("profile")}
      onNext={handleFinish}
    />
  );
}
