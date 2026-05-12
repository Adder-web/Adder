import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../api/authApi";

const PUBLIC_NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "AI Chat", to: "/chat" },
];
const AUTH_NAV_LINKS = [
  { label: "MyPage", to: "/mypage" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, accessToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    if (accessToken) {
      try {
        await logoutApi(accessToken);
      } catch {
        // 네트워크 오류 무시
      }
    }
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-white/60 border-b border-white/30 shadow-sm"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <img src={logo} alt="ADDER" className="h-8 object-contain" />
      </Link>

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-8">
        {[...PUBLIC_NAV_LINKS, ...(isAuthenticated ? AUTH_NAV_LINKS : [])].map(({ label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `relative text-sm font-medium transition-colors nav-link-underline ${
                isActive ? "text-primary" : "text-text-dark hover:text-primary"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <span className="text-sm font-medium text-text-dark">
              {user?.nickname}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-text-dark rounded-full transition-colors duration-200 hover:text-primary"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-text-dark rounded-full transition-colors duration-200 hover:text-primary"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-medium text-primary rounded-full border border-primary/30 bg-white/40 backdrop-blur-sm transition-all duration-200 hover:bg-primary/5"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger placeholder */}
      <button className="md:hidden flex flex-col gap-1.5 p-2" aria-label="메뉴">
        <span className="w-5 h-0.5 bg-text-dark rounded" />
        <span className="w-5 h-0.5 bg-text-dark rounded" />
        <span className="w-5 h-0.5 bg-text-dark rounded" />
      </button>
    </nav>
  );
}
