import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const PRODUCT_LINKS = [
  { label: "About", to: "/about" },
  { label: "AI Chat", to: "/chat" },
  { label: "MyPage", to: "/mypage" },
  { label: "Community", to: "/community" },
];

export default function Footer() {
  return (
    <footer
      className="w-full py-16 px-8"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Slogan */}
          <div className="flex flex-col gap-4">
            <img src={logo} alt="ADDER" className="h-8 object-contain object-left brightness-0 invert" />
            <p className="text-sm text-white/50 leading-relaxed">
              기억에 작은 반짝임을 더해드릴게요.<br />
              AI와 함께 나만의 향을 설계하세요.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest mb-5"
              style={{ color: "#8B8BA7", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
            >
              PRODUCT
            </p>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest mb-5"
              style={{ color: "#8B8BA7", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
            >
              SOCIAL
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-xs text-white/30" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            © 2025 ADDER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
