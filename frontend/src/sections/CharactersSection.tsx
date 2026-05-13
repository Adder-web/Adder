import { CHARACTERS } from "../data/characters";

type CharacterCardProps = {
  name: string;
  role: string;
  desc: string;
  ment: string;
  img: string;
  gradient: string;
};

export default function CharactersSection() {
  return (
    <section
      id="chat"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-28"
    >
      <div className="text-center">
        <p className="mb-6 inline-flex rounded-full border border-white/60 bg-white/30 px-5 py-2 text-label uppercase text-primary/70">
          CHARACTERS
        </p>

        <h2 className="text-title-lg text-primary-dark md:text-title-xl">
          어떤 방식으로 향을 설계할까요?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-body-sm text-primary/60 sm:text-body-md">
          대화 스타일이 다른 4명의 조향사가 준비하고 있어요.
          <br className="hidden sm:block" />
          언제든지 대화하세요.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CHARACTERS.map((character) => (
          <CharacterCard key={character.id} {...character} />
        ))}
      </div>
    </section>
  );
}

function CharacterCard({
  name,
  role,
  desc,
  ment,
  img,
  gradient,
}: CharacterCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-linear-to-br ${gradient} p-5 shadow-[0_10px_30px_rgba(75,63,140,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,63,140,0.16)]`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0)_100%)]" />

      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/50 shadow-[0_18px_35px_rgba(75,63,140,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_45px_rgba(75,63,140,0.20),inset_0_1px_1px_rgba(255,255,255,0.9)]">
        <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-white/75" />
        <span className="absolute bottom-4 left-4 h-3 w-3 rounded-full bg-white/60" />

        <div className="absolute inset-0 bg-linear-to-br from-white/35 via-transparent to-primary/10" />

        <img
          src={img}
          alt={name}
          className="relative z-10 h-[78%] w-[78%] object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="relative z-10 mt-6 text-title-sm text-primary-dark">
        {name}
      </h3>

      <p className="relative z-10 mt-2 inline-flex rounded-full border border-white/60 bg-white/40 px-2.5 text-caption text-primary/70">
        {role}
      </p>

      <p className="relative z-10 mt-5 text-caption text-primary/65">{desc}</p>

      <div className="relative z-10 mt-3 border-t border-white/40 pt-3">
        <p className="text-body-sm font-medium text-primary/75">“{ment}”</p>
      </div>
    </article>
  );
}
