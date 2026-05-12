import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import ResultHeader from "../components/result/ResultHeader";
import ResultHero from "../components/result/ResultHero";
import RecipeSection from "../components/result/RecipeSection";
import FeedbackSection from "../components/result/FeedbackSection";
import ResultActionCards from "../components/result/ResultActionCards";

import {
  createPerfumeResult,
  type PerfumeMessage,
  type PerfumeResultResponse,
} from "../api/perfumeApi";

import type { CharacterType } from "../data/perfumeQuestions";
import {
  scentResultData,
  withCharacterImage,
  type ScentResultData,
} from "../data/scentResultData";

type ResultPageState = {
  characterType?: CharacterType;
  result?: PerfumeResultResponse;
  messages?: PerfumeMessage[];
};

function isCharacterType(value: string | null): value is CharacterType {
  return (
    value === "homa" ||
    value === "move" ||
    value === "orion" ||
    value === "algo"
  );
}

export default function ScentResultPage() {
  const location = useLocation();
  const routeState = location.state as ResultPageState | null;

  const [result, setResult] = useState<ScentResultData>(scentResultData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (routeState?.result) {
          setResult(withCharacterImage(routeState.result));
          return;
        }

        const storedCharacterType = sessionStorage.getItem(
          "adder-character-type",
        );

        const storedMessages = sessionStorage.getItem("adder-chat-messages");

        const characterType: CharacterType =
          routeState?.characterType ??
          (isCharacterType(storedCharacterType) ? storedCharacterType : "homa");

        const messages =
          routeState?.messages ??
          (storedMessages
            ? (JSON.parse(storedMessages) as PerfumeMessage[])
            : []);

        if (!messages.length) {
          setResult(scentResultData);
          return;
        }

        const response = await createPerfumeResult({
          characterType,
          messages,
        });

        setResult(withCharacterImage(response));
      } catch (error) {
        console.error("향 결과 API 호출 실패:", error);
        setErrorMessage(
          "향 결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
        );
        setResult(scentResultData);
      } finally {
        setIsLoading(false);
      }
    }

    loadResult();
  }, [routeState]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#F8FAFF_0%,#F4F8FF_7%,#F0F5FF_14%,#ECF3FF_21%,#E8F0FF_29%,#E4EEFF_36%,#E0EBFF_43%,#DCE9FF_50%,#DEE8FF_57%,#E0E7FF_64%,#E2E6FF_71%,#E4E6FF_79%,#E5E5FF_86%,#E7E4FF_93%,#E9E3FF_100%)] text-[#1F2430]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-[37.5rem] w-[37.5rem] rounded-full bg-[linear-gradient(135deg,rgba(220,233,255,0.4),rgba(223,246,240,0.4))] blur-[4rem]" />
        <div className="absolute right-16 top-[30rem] h-[31.25rem] w-[31.25rem] rounded-full bg-[linear-gradient(135deg,rgba(233,227,255,0.45),rgba(216,210,255,0.4))] blur-[4rem]" />
        <div className="absolute left-1/2 top-44 h-[43.75rem] w-[43.75rem] -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,rgba(223,246,240,0.22),rgba(220,233,255,0.22))] blur-[4rem]" />
      </div>

      <Navbar />

      <div className="relative z-10 pt-[4.875rem]">
        <ResultHeader />

        <main className="mx-auto max-w-[80rem] px-4 pb-10 sm:px-8">
          {isLoading && (
            <div className="mx-auto mt-10 max-w-[80rem] rounded-2xl border border-white/70 bg-white/55 px-6 py-4 text-center text-sm font-semibold text-[#4B3F8C] shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-lg">
              대화를 바탕으로 향 결과를 만들고 있어요.
            </div>
          )}

          {errorMessage && (
            <div className="mx-auto mt-10 max-w-[80rem] rounded-2xl border border-red-200/70 bg-white/65 px-6 py-4 text-center text-sm font-semibold text-red-500 shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-lg">
              {errorMessage}
            </div>
          )}

          <ResultHero result={result} />

          <RecipeSection result={result} />

          <FeedbackSection />

          <ResultActionCards />
        </main>
      </div>
    </div>
  );
}
