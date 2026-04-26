import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "AI Chat", to: "/chat" },
  { label: "MyPage", to: "/mypage" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        {NAV_LINKS.map(({ label, to }) => (
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
      <div className="hidden md:flex items-center gap-4">
        <button className="text-sm font-medium text-text-dark hover:text-primary transition-colors">
          Log In
        </button>
        <button className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
          Sign Up
        </button>
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
