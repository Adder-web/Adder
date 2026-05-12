import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  getMyPerfumes,
  getMyPageSummary,
  updatePerfumeName,
  deletePerfume,
  type MyPerfumeItem,
  type MyPageSummary,
} from "../api/myPerfumeApi";

const CHARACTER_GRADIENTS: Record<string, string> = {
  homa: "radial-gradient(circle at 35% 35%, #E8FAF5, #B5EBDC, #7ACFB8)",
  algo: "radial-gradient(circle at 35% 35%, #EDE9FF, #D8D2FF, #A89CFF)",
  move: "radial-gradient(circle at 35% 35%, #EFF6FF, #BFDBFE, #93C5FD)",
  orion: "radial-gradient(circle at 35% 35%, #FFF7ED, #FED7AA, #FDBA74)",
};

const CHARACTER_COLORS: Record<string, string> = {
  homa: "#5BC5A7",
  algo: "#8B7DEB",
  move: "#60A5FA",
  orion: "#FB923C",
};

const CHARACTER_KO: Record<string, string> = {
  homa: "호마",
  algo: "알고",
  move: "무브",
  orion: "오리온",
};

export default function MyPage() {
  const { user, accessToken, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [perfumes, setPerfumes] = useState<MyPerfumeItem[]>([]);
  const [summary, setSummary] = useState<MyPageSummary | null>(null);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!accessToken) return;
    loadData(0);
  }, [accessToken]);

  const loadData = async (page: number) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const [perfumesRes, summaryRes] = await Promise.all([
        getMyPerfumes(accessToken, page),
        getMyPageSummary(accessToken),
      ]);
      if (perfumesRes.success) {
        setPerfumes(perfumesRes.data.items);
        setPagination({
          page: perfumesRes.data.page,
          totalPages: perfumesRes.data.totalPages,
          totalElements: perfumesRes.data.totalElements,
        });
      }
      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!accessToken || editingId === null || !editName.trim()) return;
    const res = await updatePerfumeName(accessToken, editingId, editName.trim());
    if (res.success) {
      setPerfumes((prev) =>
        prev.map((p) =>
          p.myPerfumeId === editingId ? { ...p, perfumeName: editName.trim() } : p
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || deletingId === null) return;
    const res = await deletePerfume(accessToken, deletingId);
    if (res.success) {
      setPerfumes((prev) => prev.filter((p) => p.myPerfumeId !== deletingId));
      setPagination((prev) => ({ ...prev, totalElements: prev.totalElements - 1 }));
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F8FAFF] to-[#F0F5FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#D8D2FF] border-t-[#8B7DEB]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#F8FAFF_0%,#F4F8FF_14%,#F0F5FF_29%,#E8F0FF_50%,#E4EEFF_71%,#E2E6FF_86%,#E9E3FF_100%)] text-[#1F2430]">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-[37.5rem] w-[37.5rem] rounded-full bg-[linear-gradient(135deg,rgba(220,233,255,0.35),rgba(223,246,240,0.35))] blur-[4rem]" />
        <div className="absolute right-16 top-[20rem] h-[25rem] w-[25rem] rounded-full bg-[linear-gradient(135deg,rgba(233,227,255,0.4),rgba(216,210,255,0.35))] blur-[4rem]" />
      </div>

      <Navbar />

      <div className="pt-[4.875rem]">
        {/* Breadcrumb */}
        <div className="px-8">
          <div className="mx-auto max-w-[80rem] py-3 text-[0.65rem] font-bold tracking-[0.25em] text-[#4B3F8C]/50">
            MY PAGE · 나의 향 컬렉션
          </div>
        </div>

        <div className="mx-auto flex max-w-[80rem] gap-8 px-4 pb-16 sm:px-8">
          {/* Sidebar */}
          <aside className="w-60 flex-shrink-0">
            <div className="sticky top-24 rounded-[1.5rem] border border-white/70 bg-white/60 p-6 shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-lg">
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#D8D2FF]/60 to-[#B5EBDC]/60">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#D8D2FF]/60" />
                )}
              </div>

              <h2 className="mt-4 text-center text-[1rem] font-bold text-[#1F2430]">
                {user?.nickname} 님
              </h2>

              <div className="mt-3 flex justify-center gap-2 flex-wrap">
                <span className="rounded-full border border-[#4B3F8C]/15 bg-[#D8D2FF]/40 px-3 py-1 text-[0.7rem] font-semibold text-[#4B3F8C]">
                  Adder Member
                </span>
                {pagination.totalElements > 0 && (
                  <span className="rounded-full border border-[#5BC5A7]/20 bg-[#B5EBDC]/40 px-3 py-1 text-[0.7rem] font-semibold text-[#2D9E82]">
                    향 {pagination.totalElements}개 완성
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-1">
                <button className="flex w-full items-center gap-3 rounded-[0.875rem] bg-gradient-to-r from-[#D8D2FF]/50 to-[#B5EBDC]/30 px-4 py-3 text-sm font-semibold text-[#4B3F8C]">
                  <span>✦</span>
                  나의 향 컬렉션
                </button>
                <button className="flex w-full items-center gap-3 rounded-[0.875rem] px-4 py-3 text-sm font-medium text-[#9CA3AF] transition-all hover:bg-white/50">
                  <span>◐</span>
                  계정 설정
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-6">
              <p className="text-[0.65rem] font-bold tracking-[0.25em] text-[#4B3F8C]/60">MY COLLECTION</p>
              <h1 className="mt-1 text-[2rem] font-bold text-[#1F2430]">나의 향 컬렉션</h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                대화로 설계한 향들이 여기에 모여요. 카드를 눌러 다시 만나보세요.
              </p>
            </div>

            {/* Stats Grid */}
            {summary && (
              <div className="mb-6 grid grid-cols-3 gap-4">
                {[
                  { label: "완성한 향수", value: summary.completedPerfumes, unit: "개", color: "#8B7DEB" },
                  { label: "만난 조향사", value: summary.uniqueCharacters, unit: "명", color: "#5BC5A7" },
                  { label: "나눈 대화", value: summary.chatCount, unit: "회", color: "#FB923C" },
                ].map(({ label, value, unit, color }) => (
                  <div
                    key={label}
                    className="rounded-[1.25rem] border border-white/70 bg-white/55 p-5 shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-lg"
                  >
                    <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#9CA3AF]">{label.toUpperCase()}</p>
                    <p className="mt-2 text-[2rem] font-bold leading-none" style={{ color }}>
                      {value}
                      <span className="ml-0.5 text-base font-semibold">{unit}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#9CA3AF]">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Perfume List Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[1.1rem] font-bold text-[#1F2430]">저장된 향</h2>
              {pagination.totalElements > 0 && (
                <span className="text-sm text-[#9CA3AF]">
                  {pagination.totalElements}개의 향이 저장되어 있어요
                </span>
              )}
            </div>

            {/* Perfume Grid */}
            <div className="grid grid-cols-3 gap-4">
              {perfumes.map((p) => (
                <PerfumeCard
                  key={p.myPerfumeId}
                  item={p}
                  onEdit={() => {
                    setEditingId(p.myPerfumeId);
                    setEditName(p.perfumeName);
                  }}
                  onDelete={() => setDeletingId(p.myPerfumeId)}
                />
              ))}

              {/* CTA Card */}
              <div
                onClick={() => navigate("/chat")}
                className="group flex min-h-[17rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-dashed border-[#4B3F8C]/20 bg-white/30 p-8 transition-all hover:border-[#4B3F8C]/35 hover:bg-white/50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#D8D2FF] to-[#B5EBDC] text-xl text-[#4B3F8C] transition-transform group-hover:scale-110">
                  ✦
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#4B3F8C]">새로운 향 설계하기</p>
                  <p className="mt-1 text-xs text-[#9CA3AF]">캐릭터와 대화를 시작해보세요</p>
                </div>
                <button className="rounded-full border border-[#4B3F8C]/20 bg-white/60 px-5 py-2 text-xs font-semibold text-[#4B3F8C] transition-all hover:bg-white/90">
                  시작하기 →
                </button>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => loadData(pagination.page - 1)}
                  disabled={pagination.page === 0}
                  className="px-3 py-1.5 text-sm text-[#4B3F8C] disabled:opacity-30"
                >
                  ← 이전
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => loadData(i)}
                    className={`h-8 w-8 rounded-full text-sm font-medium transition-all ${
                      i === pagination.page
                        ? "bg-gradient-to-b from-[#B8AEFF] to-[#8B7DEB] text-white shadow-[0_4px_12px_rgba(139,125,235,0.35)]"
                        : "bg-white/60 text-[#4B3F8C] hover:bg-white/90"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => loadData(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className="px-3 py-1.5 text-sm text-[#4B3F8C] disabled:opacity-30"
                >
                  다음 →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-80 rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(75,63,140,0.2)] backdrop-blur-xl">
            <h3 className="text-base font-bold text-[#1F2430]">향수명 수정</h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
              className="mt-3 w-full rounded-xl border border-[#4B3F8C]/15 bg-white/60 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7DEB]/30"
              placeholder="새 향수명 입력"
              autoFocus
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 rounded-xl border border-[#4B3F8C]/15 py-2 text-sm text-[#4B3F8C]"
              >
                취소
              </button>
              <button
                onClick={handleUpdateName}
                className="flex-1 rounded-xl bg-gradient-to-b from-[#B8AEFF] to-[#8B7DEB] py-2 text-sm font-semibold text-white"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-80 rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_60px_rgba(75,63,140,0.2)] backdrop-blur-xl">
            <h3 className="text-base font-bold text-[#1F2430]">향수 삭제</h3>
            <p className="mt-2 text-sm text-[#6B7280]">
              이 향수를 보관함에서 삭제할까요? 삭제 후 복구할 수 없어요.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 rounded-xl border border-[#4B3F8C]/15 py-2 text-sm text-[#4B3F8C]"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PerfumeCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MyPerfumeItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dateStr = new Date(item.savedAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <article className="group relative overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/55 shadow-[0_8px_24px_rgba(75,63,140,0.08)] backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(75,63,140,0.14)]">
      {/* Thumbnail */}
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#F8FAFF] to-[#F0F5FF]">
        <div
          className="h-24 w-24 rounded-full shadow-[0_8px_32px_rgba(75,63,140,0.15)]"
          style={{
            background: CHARACTER_GRADIENTS[item.characterType] ?? "radial-gradient(circle at 35% 35%, #EDE9FF, #D8D2FF, #A89CFF)",
          }}
        />

        <div ref={menuRef} className="absolute right-3 top-3">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-[#4B3F8C] shadow-sm backdrop-blur-sm transition-all hover:bg-white"
          >
            ★
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 z-10 overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-lg backdrop-blur-sm">
              <button
                onClick={() => { onEdit(); setShowMenu(false); }}
                className="block w-full px-4 py-2 text-left text-sm text-[#1F2430] hover:bg-[#F8FAFF]"
              >
                수정
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="truncate text-sm font-bold text-[#1F2430]">{item.perfumeName}</h3>
        {item.noteSummary && (
          <p className="mt-1 truncate text-xs text-[#6B7280]">{item.noteSummary}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: CHARACTER_COLORS[item.characterType] ?? "#8B7DEB" }}
            />
            <span className="text-xs text-[#6B7280]">{CHARACTER_KO[item.characterType] ?? item.characterType}</span>
          </div>
          <span className="text-xs text-[#9CA3AF]">{dateStr}</span>
        </div>
      </div>
    </article>
  );
}
