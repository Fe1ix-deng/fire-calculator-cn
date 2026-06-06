import { Link } from "react-router-dom";

const features = [
  {
    icon: "🏠",
    title: "本土化设计",
    text: "社保、公积金、父母赡养、房产全纳入计算",
  },
  {
    icon: "🧭",
    title: "引导式评估",
    text: "回答问题，系统帮你算",
  },
  {
    icon: "📊",
    title: "个性化结果",
    text: "不是模板，是属于你的分析",
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-inner">
          <h1>你知道自己要工作到几岁吗？</h1>
          <p>输入你的财务情况，算出距离 FIRE 还有多远</p>
          <div className="hero-actions">
            <Link className="primary-action" to="/questionnaire">
              开始深度评估 →
            </Link>
            <Link className="secondary-action" to="/calculators">
              直接用计算器
            </Link>
          </div>
        </div>
      </section>

      <section className="features" aria-label="产品特点">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <div className="feature-icon">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <footer className="home-footer">仅供参考，不构成投资建议</footer>
    </main>
  );
}
