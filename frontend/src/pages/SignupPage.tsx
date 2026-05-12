import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FloatingCharacters from "../components/FloatingCharacters";
import { signup } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

interface TermsState {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  aiData: boolean;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [terms, setTerms] = useState<TermsState>({
    all: false,
    terms: false,
    privacy: false,
    aiData: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleAgreeAll = (checked: boolean) => {
    setTerms({ all: checked, terms: checked, privacy: checked, aiData: checked });
  };

  const handleTermChange = (key: keyof Omit<TermsState, "all">, checked: boolean) => {
    const next = { ...terms, [key]: checked };
    next.all = next.terms && next.privacy && next.aiData;
    setTerms(next);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSignup = async () => {
    if (!terms.terms || !terms.privacy) {
      setError("필수 약관에 동의해 주세요.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        agreeTerms: terms.terms,
        agreePrivacy: terms.privacy,
        agreeAiData: terms.aiData,
      });
      if (res.success) {
        login(res.data.accessToken, {
          userId: res.data.userId,
          nickname: res.data.nickname,
          profileImage: res.data.profileImage,
        });
        navigate("/");
      } else {
        setError(res.message || "회원가입에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = terms.terms && terms.privacy;

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-text-dark placeholder-gray-300 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition";

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ddd8f5 0%, #ead8f5 28%, #d5eaf0 65%, #ddd8f5 100%)",
      }}
    >
      {/* Soft glow blobs */}
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-50 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #a0f0d0 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #c0a0f0 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-24 right-24 w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f0a8c0 0%, transparent 65%)",
        }}
      />

      <FloatingCharacters />
      <Navbar />

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-8 px-4">
        <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold text-text-dark tracking-[0.12em] uppercase">
              Join Adder
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[2rem] font-bold text-text-dark mb-1 leading-tight">
            함께 나만의
            <br />
            향을 설계해요
          </h1>
          <p className="text-sm text-text-gray mb-5 leading-relaxed">
            Adera Planet의 새로운 가족이 되어주세요.
          </p>

          {/* Step indicator */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-text-gray mb-2 tracking-widest">
              STEP {step}/2
            </p>
            <div className="flex gap-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-primary transition-all duration-500" />
              <div
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  step === 2 ? "bg-primary" : "bg-gray-200"
                }`}
              />
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleStep1Next} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  이름
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="이름을 입력해 주세요"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  이메일
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hello@adder.kr"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="6자 이상 입력해 주세요"
                  required
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg py-2 px-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-light-purple text-white font-semibold text-sm mt-2 hover:bg-primary transition active:scale-[0.98]"
              >
                다음 단계
              </button>

              <p className="text-center text-xs text-text-gray pt-1">
                이미 계정이 있으신가요?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  로그인
                </Link>
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Terms box */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={terms.all}
                    onChange={(e) => handleAgreeAll(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm font-semibold text-text-dark">
                    전체 동의하기
                  </span>
                </label>

                <hr className="border-gray-100" />

                {(
                  [
                    { key: "terms", label: "이용 약관 동의", required: true },
                    {
                      key: "privacy",
                      label: "개인정보 수집 및 이용 동의",
                      required: true,
                    },
                    {
                      key: "aiData",
                      label: "AI 학습 데이터 활용",
                      required: false,
                    },
                  ] as const
                ).map(({ key, label, required }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={terms[key]}
                      onChange={(e) => handleTermChange(key, e.target.checked)}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-sm text-text-gray">
                      {label}{" "}
                      <span
                        className={`text-xs font-medium ${
                          required ? "text-primary" : "text-text-gray"
                        }`}
                      >
                        ({required ? "필수" : "선택"})
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2 px-3">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleSignup}
                disabled={isLoading || !canSubmit}
                className={`w-full py-3.5 rounded-full font-semibold text-sm transition active:scale-[0.98] ${
                  canSubmit && !isLoading
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-light-purple/50 text-white/70 cursor-not-allowed"
                }`}
              >
                {isLoading ? "가입 중..." : "Adder 가입하기"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
                className="w-full text-xs text-text-gray hover:text-primary transition text-center"
              >
                ← 이전으로
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
