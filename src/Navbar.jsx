import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "计算器", to: "/calculators", match: (path) => path.startsWith("/calculator") || path === "/calculators" },
  { label: "快速测试", to: "/quiz", match: (path) => path === "/quiz" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="home-nav site-navbar">
      <Link className="home-logo" to="/">
        🔥 早日退休
      </Link>
      <div className="navbar-center" aria-label="主导航">
        {navItems.map((item) => (
          <Link className={item.match(location.pathname) ? "navbar-link active" : "navbar-link"} key={item.to} to={item.to}>
            {item.label}
          </Link>
        ))}
      </div>
      <Link className="nav-cta" to="/questionnaire">
        深度评估
      </Link>
    </nav>
  );
}
