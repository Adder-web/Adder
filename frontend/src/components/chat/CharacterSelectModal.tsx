import { CHARACTERS, type CharacterType } from "../../data/characters";

type CharacterSelectModalProps = {
  isOpen: boolean;
  onSelect: (character: CharacterType) => void;
};

export default function CharacterSelectModal({
  isOpen,
  onSelect,
}: CharacterSelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-primary-dark/25 backdrop-blur-md" />

      <section className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 px-5 py-8 shadow-[0_24px_80px_rgba(75,63,140,0.22)] backdrop-blur-2xl sm:px-8 md:py-10">
        <div className="text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/70 bg-white/50 px-4 py-1.5 text-label uppercase text-primary/70">
            SELECT PERFUMER
          </p>

          <h2 className="text-title-md text-primary-dark sm:text-title-lg md:text-title-xl">
            어떤 조향사와 대화할까요?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-body-sm text-primary/60 sm:text-body-md">
            선택한 캐릭터의 말투와 방식으로 향을 설계해요.
            <br className="hidden sm:block" />
            나에게 맞는 조향사를 골라주세요.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTERS.map((character) => (
            <button
              key={character.id}
              type="button"
              onClick={() => onSelect(character.id)}
              className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-linear-to-br ${character.gradient} p-4 text-left shadow-[0_10px_30px_rgba(75,63,140,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,63,140,0.16)] focus:outline-none focus:ring-2 focus:ring-primary/30`}
            >
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_100%)]" />

              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/50 shadow-[0_18px_35px_rgba(75,63,140,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_45px_rgba(75,63,140,0.20),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <div className="absolute inset-0 bg-linear-to-br from-white/35 via-transparent to-primary/10" />

                <img
                  src={character.img}
                  alt={character.name}
                  className="relative z-10 h-[78%] w-[78%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="relative z-10 mt-5 text-title-sm text-primary-dark">
                {character.name}
              </h3>

              <p className="relative z-10 mt-2 inline-flex rounded-full border border-white/60 bg-white/40 px-2.5 py-0.5 text-caption text-primary/70">
                {character.role}
              </p>

              <p className="relative z-10 mt-4 min-h-[2.8rem] text-caption leading-relaxed text-primary/65">
                {character.desc}
              </p>

              <div className="relative z-10 mt-4 border-t border-white/40 pt-3">
                <p className="text-body-sm font-medium text-primary/75">
                  “{character.ment}”
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
