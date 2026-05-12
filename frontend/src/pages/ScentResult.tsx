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

  useEffect(() => {
    if (!isLoading) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#F8FAFF_0%,#F4F8FF_7%,#F0F5FF_14%,#ECF3FF_21%,#E8F0FF_29%,#E4EEFF_36%,#E0EBFF_43%,#DCE9FF_50%,#DEE8FF_57%,#E0E7FF_64%,#E2E6FF_71%,#E4E6FF_79%,#E5E5FF_86%,#E7E4FF_93%,#E9E3FF_100%)] text-[#1F2430]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-[37.5rem] w-[37.5rem] rounded-full bg-[linear-gradient(135deg,rgba(220,233,255,0.4),rgba(223,246,240,0.4))] blur-[4rem]" />
        <div className="absolute right-16 top-[30rem] h-[31.25rem] w-[31.25rem] rounded-full bg-[linear-gradient(135deg,rgba(233,227,255,0.45),rgba(216,210,255,0.4))] blur-[4rem]" />
        <div className="absolute left-1/2 top-44 h-[43.75rem] w-[43.75rem] -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,rgba(223,246,240,0.22),rgba(220,233,255,0.22))] blur-[4rem]" />
      </div>

      <div
        className={
          isLoading
            ? "pointer-events-none select-none blur-[6px] transition duration-300"
            : "transition duration-300"
        }
      >
        <Navbar />

        <div className="relative z-10 pt-[4.875rem]">
          <ResultHeader />

          <main className="mx-auto max-w-[80rem] px-4 pb-10 sm:px-8">
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

      {isLoading && (
        <div
          className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-[#F8FAFF]/45 px-6 backdrop-blur-[10px]"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full max-w-[26rem] overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 px-8 py-9 text-center shadow-[0_24px_70px_rgba(75,63,140,0.22)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(216,210,255,0.75),transparent_38%),radial-gradient(circle_at_75%_75%,rgba(181,235,220,0.58),transparent_42%)]" />

            <div className="relative z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#8B7DEB]/20 bg-white/65 shadow-[0_12px_30px_rgba(139,125,235,0.18)]">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#D8D2FF] border-t-[#8B7DEB]" />
              </div>

              <p className="mt-6 text-[0.6875rem] font-bold tracking-[0.34em] text-[#4B3F8C]">
                SCENT RESULT
              </p>

              <h2 className="mt-3 text-[1.5rem] font-bold text-[#1F2430]">
                향 결과를 조향하고 있어요
              </h2>

              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-[#4B5563]">
                대화 속 기억과 감정을 분석해서
                <br />
                당신만의 향 노트를 구성하는 중이에요.
              </p>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#4B3F8C]/10">
                <div className="h-full w-2/3 animate-[resultLoading_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-[#B5EBDC] via-[#D8D2FF] to-[#8B7DEB]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
