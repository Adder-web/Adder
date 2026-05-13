import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";

import PerfumeBottle from "../assets/adder-perfume.png";

function getParam(name: string) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

function getSafeFileName(name: string) {
  return name
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export default function ScentSharePage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const result = useMemo(() => {
    const moodsText = getParam("moods");

    return {
      englishName: getParam("englishName") || "Adder Scent",
      koreanName: getParam("koreanName") || "나만의 향",
      date: getParam("date") || "",
      summary: getParam("summary") || "",
      moods: moodsText ? moodsText.split(",") : [],
      perfumerName: getParam("perfumerName") || "Adder",
      perfumerRole: getParam("perfumerRole") || "AI Perfumer",
    };
  }, []);

  const handleSaveHeader = async () => {
    if (!cardRef.current || isSaving) return;

    try {
      setIsSaving(true);

      await document.fonts.ready;

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#F8FAFF",

        // 외부 Google Fonts CSS 인라인 처리 중 발생하는 에러 방지
        skipFonts: true,
      } as any);

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${getSafeFileName(result.englishName)}-header.png`;
      link.click();
    } catch (error) {
      console.error("헤더 저장 실패:", error);
      alert("이미지를 저장하지 못했어요. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] px-4 py-8 text-[#1F2430]">
      <div className="mx-auto flex max-w-[76rem] flex-col items-center gap-6">
        <div
          ref={cardRef}
          className="relative grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-[#F8FAFF] px-6 py-10 shadow-[0_24px_80px_rgba(75,63,140,0.12)] sm:px-10 lg:grid-cols-[1fr_28rem] lg:px-14 lg:py-14"
        >
          <div className="relative z-10">
            <p className="text-[0.6875rem] font-bold tracking-[0.34em] text-[#4B3F8C]">
              SCENT RESULT {result.date && `· ${result.date}`}
            </p>

            <h1 className="mt-4 font-serif text-[3.25rem] font-medium leading-[0.98] text-[#4B3F8C] sm:text-[5rem]">
              {result.englishName}
            </h1>

            <h2 className="mt-3 text-[2rem] font-bold leading-tight text-[#1F2430] sm:text-[3rem]">
              {result.koreanName}
            </h2>

            {result.summary && (
              <p className="mt-6 max-w-[30rem] whitespace-pre-line text-[0.9375rem] leading-[1.7] text-[#4B5563]">
                {result.summary}
              </p>
            )}

            {result.moods.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {result.moods.map((mood) => (
                  <span
                    key={mood}
                    className="rounded-full border border-[#4B3F8C]/10 bg-[#D8D2FF]/45 px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em] text-[#4B3F8C]"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 inline-flex items-center gap-3 rounded-[1.125rem] border border-[#4B3F8C]/10 bg-white/60 px-5 py-3 shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B5EBDC]/60 text-[1.25rem]">
                ✦
              </div>

              <div>
                <p className="text-[0.875rem] font-bold text-[#1F2430]">
                  {result.perfumerName}
                </p>
                <p className="mt-0.5 text-[0.75rem] font-bold tracking-[0.04em] text-[#4B3F8C]">
                  {result.perfumerRole}
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex h-[22rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-white/80 via-[#EEF4FF]/70 to-[#DFF6F0]/50 shadow-[0_18px_48px_rgba(75,63,140,0.14)] backdrop-blur-xl lg:mt-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(216,210,255,0.7),transparent_46%),radial-gradient(circle_at_70%_70%,rgba(181,235,220,0.55),transparent_48%)]" />

            <img
              src={PerfumeBottle}
              alt={`${result.koreanName} 향수 이미지`}
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_28px_34px_rgba(75,63,140,0.22)]"
            />
          </div>

          <div className="pointer-events-none absolute left-0 top-[16rem] hidden h-[20rem] w-[42rem] opacity-80 lg:block">
            {Array.from({ length: 28 }).map((_, index) => (
              <span
                key={index}
                className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                style={{
                  width: `${3 + (index % 5)}px`,
                  height: `${3 + (index % 5)}px`,
                  left: `${(index * 47) % 620}px`,
                  top: `${(index * 83) % 300}px`,
                  opacity: 0.45 + (index % 4) * 0.12,
                }}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveHeader}
          disabled={isSaving}
          className="rounded-full bg-gradient-to-b from-[#B8AEFF] to-[#8B7DEB] px-8 py-4 text-[0.9375rem] font-semibold text-white shadow-[0_8px_22px_rgba(139,125,235,0.35),inset_0_1px_0_1px_rgba(255,255,255,0.4)] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "저장 중..." : "헤더 저장하기 ↓"}
        </button>
      </div>
    </main>
  );
}
