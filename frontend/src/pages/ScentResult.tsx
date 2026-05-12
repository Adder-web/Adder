import Navbar from "../components/Navbar";
import ResultHeader from "../components/result/ResultHeader";
import ResultHero from "../components/result/ResultHero";
import RecipeSection from "../components/result/RecipeSection";
import FeedbackSection from "../components/result/FeedbackSection";
import ResultActionCards from "../components/result/ResultActionCards";
import { scentResultData } from "../data/scentResultData";

export default function ScentResultPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#F8FAFF_0%,#F4F8FF_7%,#F0F5FF_14%,#ECF3FF_21%,#E8F0FF_29%,#E4EEFF_36%,#E0EBFF_43%,#DCE9FF_50%,#DEE8FF_57%,#E0E7FF_64%,#E2E6FF_71%,#E4E6FF_79%,#E5E5FF_86%,#E7E4FF_93%,#E9E3FF_100%)] text-[#1F2430]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-[37.5rem] w-[37.5rem] rounded-full bg-[linear-gradient(135deg,rgba(220,233,255,0.4),rgba(223,246,240,0.4))] blur-[4rem]" />
        <div className="absolute right-16 top-[30rem] h-[31.25rem] w-[31.25rem] rounded-full bg-[linear-gradient(135deg,rgba(233,227,255,0.45),rgba(216,210,255,0.4))] blur-[4rem]" />
        <div className="absolute left-1/2 top-44 h-[43.75rem] w-[43.75rem] -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,rgba(223,246,240,0.22),rgba(220,233,255,0.22))] blur-[4rem]" />
      </div>

      <Navbar />

      {/* Navbar가 fixed라서 그 아래부터 화면이 시작되도록 여백 줌 */}
      <div className="relative z-10 pt-[4.875rem]">
        <ResultHeader />

        <main className="mx-auto max-w-[80rem] px-4 pb-10 sm:px-8">
          <ResultHero result={scentResultData} />

          <RecipeSection result={scentResultData} />

          <FeedbackSection />

          <ResultActionCards />
        </main>
      </div>
    </div>
  );
}
