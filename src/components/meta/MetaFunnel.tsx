"use client";

import { useEffect, useState } from "react";
import { QUIZ_QUESTIONS } from "@/lib/meta/quizData";
import { captureMetaAttribution, metaPixel } from "@/lib/meta/tracking";
import HeroScreen, { StickyStartBar } from "./HeroScreen";
import QuizScreen from "./QuizScreen";
import VerifyingScreen from "./VerifyingScreen";
import MatchScreen from "./MatchScreen";
import LeadFormScreen, { type LeadData } from "./LeadFormScreen";
import CalendlyScreen from "./CalendlyScreen";

type Screen =
  | "hero"
  | "quiz"
  | "verifying"
  | "match"
  | "leadForm"
  | "calendly";

const FIRST_QUESTION_ID = QUIZ_QUESTIONS[0].id;

export default function MetaFunnel() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lead, setLead] = useState<LeadData | null>(null);
  // Skip the entrance animation on the very first paint (hero = LCP element).
  const [animate, setAnimate] = useState(false);

  // Page-load: capture Meta click params + fire the top-of-funnel view event.
  useEffect(() => {
    captureMetaAttribution();
    metaPixel.viewContent();
  }, []);

  function handleStart() {
    metaPixel.quizStart();
    setAnimate(true);
    setQuizIndex(0);
    setScreen("quiz");
  }

  function handleAnswer(value: string) {
    const question = QUIZ_QUESTIONS[quizIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    metaPixel.quizStep(quizIndex + 1);

    if (quizIndex === QUIZ_QUESTIONS.length - 1) {
      setScreen("verifying");
    } else {
      setQuizIndex(quizIndex + 1);
    }
  }

  function handleQuizBack() {
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
    } else {
      setScreen("hero");
    }
  }

  function handleVerifyDone() {
    // Every quiz path ends on the match screen — always "we're a match".
    setScreen("match");
  }

  function handleLeadSubmit(submitted: LeadData) {
    setLead(submitted);
    metaPixel.lead();
    setScreen("calendly");
  }

  const screenKey = screen === "quiz" ? `quiz-${quizIndex}` : screen;

  function renderScreen() {
    switch (screen) {
      case "hero":
        return <HeroScreen onStart={handleStart} />;
      case "quiz":
        return (
          <QuizScreen
            question={QUIZ_QUESTIONS[quizIndex]}
            stepNumber={quizIndex + 1}
            totalSteps={QUIZ_QUESTIONS.length}
            answeredValue={answers[QUIZ_QUESTIONS[quizIndex].id]}
            onAnswer={handleAnswer}
            onBack={handleQuizBack}
          />
        );
      case "verifying":
        return <VerifyingScreen onDone={handleVerifyDone} />;
      case "match":
        return (
          <MatchScreen
            businessValue={answers[FIRST_QUESTION_ID]}
            onContinue={() => setScreen("leadForm")}
          />
        );
      case "leadForm":
        return <LeadFormScreen onSubmit={handleLeadSubmit} />;
      case "calendly":
        return (
          <CalendlyScreen
            name={lead?.firstName ?? ""}
            email={lead?.email ?? ""}
          />
        );
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#FAFBFC] text-[#0F172A]">
      {/* Atmosphere is handled locally by Hero (the spec calls for a single
          soft blue glow behind the hero only). Lower sections sit on the
          flat #FAFBFC base and get their visual rhythm from card styles
          and generous vertical spacing. */}

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[520px] flex-col px-5">
        <div
          key={screenKey}
          className={`flex w-full flex-1 flex-col ${animate ? "meta-screen-in" : ""}`}
        >
          {renderScreen()}
        </div>
      </div>

      {screen === "hero" && <StickyStartBar onStart={handleStart} />}
    </main>
  );
}
