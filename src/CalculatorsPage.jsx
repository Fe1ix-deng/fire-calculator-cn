import { Link } from "react-router-dom";

const comingSoon = [
  {
    icon: "⛵",
    title: "Coast FIRE",
    text: "算出你现在存够多少，之后可以停止储蓄",
  },
  {
    icon: "☕",
    title: "Barista FIRE",
    text: "半退休：部分收入+投资组合的平衡点",
  },
  {
    icon: "🔄",
    title: "反向 FIRE",
    text: "设定目标退休年龄，倒推需要的储蓄率",
  },
  {
    icon: "📊",
    title: "储蓄率计算器",
    text: "你的储蓄率如何影响退休时间线",
  },
  {
    icon: "💸",
    title: "提取率计算器",
    text: "退休后资产能撑多少年",
  },
];

export default function CalculatorsPage() {
  return (
    <main className="home-page calculators-page">
      <section className="calculators-header">
        <h1>选择一个计算器</h1>
        <p>从最适合你的起点开始</p>
      </section>

      <section className="calculator-grid" aria-label="计算器列表">
        <Link className="calculator-card calculator-card-ready" to="/calculator/standard">
          <span className="ready-badge">最常用</span>
          <div className="calculator-icon">🎯</div>
          <h2>FIRE 目标计算器</h2>
          <p>算出你需要积累多少钱才能退休</p>
        </Link>

        {comingSoon.map((item) => (
          <article className="calculator-card calculator-card-disabled" key={item.title} aria-disabled="true">
            <span className="soon-badge">即将推出</span>
            <div className="calculator-icon">{item.icon}</div>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="questionnaire-banner">
        <div>
          <h2>不知道从哪里开始？</h2>
          <p>回答几个问题，我们帮你找到最适合的路径</p>
        </div>
        <Link className="banner-action" to="/questionnaire">
          开始深度评估 →
        </Link>
      </section>
    </main>
  );
}
