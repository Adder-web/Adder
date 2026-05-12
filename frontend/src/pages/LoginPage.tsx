import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FloatingCharacters from "../components/FloatingCharacters";
import { emailLogin, socialLogin } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await emailLogin(email, password);
      if (res.success) {
        console.log("[Login] 이메일 로그인 성공:", res.data.nickname);
        login(res.data.accessToken, {
          userId: res.data.userId,
          nickname: res.data.nickname,
          profileImage: res.data.profileImage,
        });
        navigate("/");
      } else {
        setError(res.message || "로그인에 실패했습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Google 로그인 설정이 필요합니다.");
      return;
    }
    if (!window.google) {
      setError("Google 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile",
      callback: async (tokenResponse) => {
        setIsLoading(true);
        try {
          const res = await socialLogin("google", tokenResponse.access_token);
          if (res.success) {
            console.log("[Login] Google 로그인 성공:", res.data.nickname);
            login(res.data.accessToken, {
              userId: res.data.userId,
              nickname: res.data.nickname,
              profileImage: res.data.profileImage,
            });
            navigate("/");
          } else {
            setError(res.message || "Google 로그인에 실패했습니다.");
          }
        } catch {
          setError("네트워크 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      },
    });
    tokenClient.requestAccessToken();
  };

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
              Welcome Back
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[2rem] font-bold text-text-dark mb-2 leading-tight">
            다시 만나서
            <br />
            반가워요
          </h1>
          <p className="text-sm text-text-gray mb-7 leading-relaxed">
            당신의 향 이야기를 이어가볼까요?
            <br />
            조향사 캐릭터들이 기다리고 있어요.
          </p>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@adder.kr"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-text-dark placeholder-gray-300 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-text-dark placeholder-gray-300 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-gray hover:text-primary transition"
                >
                  {showPassword ? "숨기기" : "표시"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-xs text-text-gray">로그인 상태 유지</span>
              </label>
              <button
                type="button"
                className="text-xs text-text-gray hover:text-primary transition"
              >
                비밀번호 찾기
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-primary text-white font-semibold text-sm transition hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-text-gray whitespace-nowrap">
              또는 간편 로그인
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-text-dark flex items-center justify-center gap-2.5 hover:bg-gray-50 active:scale-[0.98] transition disabled:opacity-60"
          >
            <GoogleIcon />
            Google 로그인
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-text-gray mt-6">
            아직 Adder가 처음이신가요?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              회원가입
            </Link>
          </p>

          <div className="mt-3 text-center">
            <Link
              to="/"
              className="text-xs text-text-gray hover:text-primary transition"
            >
              비회원으로 이용하기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
