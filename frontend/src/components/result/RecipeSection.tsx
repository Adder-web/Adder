import type { ScentNote } from "../../api/perfumeApi";
import type { ScentResultData } from "../../data/scentResultData";
import ScentRadarChart from "./ScentRadarChart";

type RecipeSectionProps = {
  result: ScentResultData;
};

const noteStyle: Record<
  ScentNote["color"],
  {
    badge: string;
    text: string;
    bar: string;
  }
> = {
  mint: {
    badge: "bg-[#B5EBDC]/50",
    text: "text-[#1F7565]",
    bar: "from-[#B5EBDC] to-[#6FCBB1]",
  },
  purple: {
    badge: "bg-[#D8D2FF]/70",
    text: "text-[#4B3F8C]",
    bar: "from-[#D8D2FF] to-[#8B7DEB]",
  },
  yellow: {
    badge: "bg-[#FFE5A8]/60",
    text: "text-[#A37800]",
    bar: "from-[#FFE5A8] to-[#E0B86A]",
  },
};

function NoteItem({ note }: { note: ScentNote }) {
  const style = noteStyle[note.color];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5">
        <span
          className={`rounded-full px-2.5 py-1.5 text-[0.6875rem] font-bold ${style.badge} ${style.text}`}
        >
          {note.type}
        </span>

        <strong className="pt-1 text-[1.125rem] font-bold text-[#1F2430]">
          {note.name}
        </strong>
      </div>

      <p className="text-[0.8125rem] text-[#4B5563]">{note.description}</p>

      <div className="h-2 overflow-hidden rounded-full bg-[#4B3F8C]/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
          style={{ width: `${note.ratio}%` }}
        />
      </div>
    </div>
  );
}

export default function RecipeSection({ result }: RecipeSectionProps) {
  return (
    <section className="rounded-[1.5rem] border border-white/80 bg-white/60 px-5 py-8 shadow-[0_18px_48px_rgba(75,63,140,0.14)] backdrop-blur-xl sm:px-8 lg:px-12 lg:py-[5.5rem]">
      <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.32em] text-[#4B3F8C]">
            SCENT RECIPE
          </p>

          <h3 className="mt-2 text-[2.25rem] font-bold leading-[1.15] text-[#1F2430]">
            당신의 이야기에서 발견한 향
          </h3>

          <p className="mt-4 text-[0.875rem] leading-[1.6] text-[#4B5563]">
            {result.perfumer.name}와 나눈 대화 속 기억과 감정을 바탕으로 설계된
            향 노트예요.
            <br />각 비율은 {result.perfumer.name}의 해석에 따라 달라져요.
          </p>

          <div className="mt-8 space-y-6">
            {result.notes.map((note) => (
              <NoteItem key={note.type} note={note} />
            ))}
          </div>
        </div>

        <aside className="rounded-[1.5rem] border border-[#4B3F8C]/10 bg-white/50 p-6">
          <p className="text-center text-[0.8125rem] font-bold uppercase tracking-[0.32em] text-[#4B3F8C]">
            SCENT BALANCE
          </p>

          <div className="mt-2">
            <ScentRadarChart data={result.balance} />
          </div>

          <p className="mt-3 text-center text-[0.6875rem] font-bold uppercase tracking-[0.32em] text-[#4B3F8C]">
            KEYWORDS
          </p>

          <div className="mx-auto mt-4 flex max-w-[24rem] flex-wrap justify-center gap-2">
            {result.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[#4B3F8C]/10 bg-[#D8D2FF]/40 px-3.5 py-2 text-[0.8125rem] font-medium text-[#4B3F8C]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
