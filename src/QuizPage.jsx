import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "./AppContext.jsx";

const questions = [
  {
    id: "age",
    title: "你今年多大？",
    type: "number",
    min: 18,
    max: 65,
    unit: "岁",
    defaultValue: 28,
  },
  {
    id: "retireAge",
    title: "你希望几岁退休？",
    type: "number",
    min: 30,
    max: 75,
    unit: "岁",
    defaultValue: 50,
  },
  {
    id: "assets",
    title: "你现在有多少金融资产？",
    hint: "存款、基金、股票等全部加起来",
    type: "number",
    min: 0,
    max: 1000,
    step: 5,
    unit: "万元",
    defaultValue: 30,
  },
  {
    id: "income",
    title: "你的税后月收入大概是多少？",
    type: "number",
    min: 0,
    max: 100000,
    step: 500,
    unit: "元/月",
    defaultValue: 10000,
  },
  {
    id: "spending",
    title: "你现在每年大概花多少钱？",
    options: ["5万以下", "5-10万", "10-20万", "20-40万", "40万以上"],
  },
  {
    id: "lifestyle",
    title: "退休后你希望过什么样的生活？",
    options: [
      "能不工作就行，支出越低越好",
      "和现在差不多，维持当前水平",
      "比现在更好，旅行美食不将就",
      "做点喜欢的事或兼职，不完全靠投资",
    ],
  },
  {
    id: "workState",
    title: "你理想的退休工作状态是？",
    options: ["完全不工作，靠投资生活", "偶尔接点自己感兴趣的项目", "做份轻松的兼职，保持社交", "还没想好"],
  },
  {
    id: "motivation",
    title: "你想要实现FIRE最主要的动机是什么？",
    options: ["从此不再为钱焦虑", "有更多时间陪家人", "做自己真正想做的事", "不想在一份不喜欢的工作里耗下去", "趁年轻多体验世界"],
  },
];

const resultCopy = {
  Lean: {
    title: "Lean FIRE",
    reason: "你更看重自由本身，也愿意用更低支出来换取更早的选择权。",
    points: ["目标金额相对更低，达成速度更快", "需要长期维持克制且稳定的生活方式", "适合先追求脱离高压工作，再慢慢优化生活质量"],
  },
  Regular: {
    title: "Regular FIRE",
    reason: "你希望退休后维持当前生活水平，这是一条最均衡、也最容易长期执行的路径。",
    points: ["以当前支出为核心估算 FIRE 目标", "对收入、储蓄率和投资收益的要求适中", "适合大多数想稳步规划财务自由的人"],
  },
  Fat: {
    title: "Fat FIRE",
    reason: "你希望退休后的生活质量更高，同时收入条件也更适合支撑更大的目标金额。",
    points: ["目标金额更高，但生活余量更充足", "适合高收入、高储蓄能力的人群", "需要更重视资产配置和风险缓冲"],
  },
  Barista: {
    title: "Barista FIRE",
    reason: "你不一定想完全停止工作，而是希望用轻量收入和投资组合一起支撑生活。",
    points: ["投资组合只需要覆盖部分支出", "保留一定工作、社交或兴趣收入", "适合想先降低工作强度的人"],
  },
  Coast: {
    title: "Coast FIRE",
    reason: "你还年轻，并且已经有一定资产基础，适合让早期本金靠复利继续成长。",
    points: ["早期本金是核心，后续压力可逐渐降低", "适合年轻且资产已有积累的人", "重点是确认现在的资产是否足够滚到目标年龄"],
  },
};

export default function QuizPage() {
  const { updateData } = useAppData();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [pendingOption, setPendingOption] = useState(null);
  const done = index >= questions.length;
  const current = questions[index];
  const progress = done ? 100 : (index / questions.length) * 100;
  const result = useMemo(() => getResult(answers), [answers]);

  const choose = (option) => {
    if (pendingOption) return;
    setPendingOption(option);
    const nextAnswers = { ...answers, [current.id]: option };
    setAnswers(nextAnswers);
    window.setTimeout(() => {
      if (index === questions.length - 1) {
        updateData(getQuizSharedData(nextAnswers));
      }
      setIndex((currentIndex) => currentIndex + 1);
      setPendingOption(null);
    }, 280);
  };

  const setNumberAnswer = (value) => {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: value }));
  };

  const goNext = () => {
    if (pendingOption) return;
    const nextAnswers = {
      ...answers,
      [current.id]: getCurrentAnswer(current, answers),
    };
    setAnswers(nextAnswers);
    if (index === questions.length - 1) {
      updateData(getQuizSharedData(nextAnswers));
    }
    setIndex((currentIndex) => currentIndex + 1);
  };

  const goBack = () => {
    setPendingOption(null);
    setIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  if (done) {
    const copy = resultCopy[result];
    return (
      <main className="quiz-page">
        <section className="quiz-result-card">
          <p className="quiz-kicker">快速测试结果</p>
          <h1>你最适合 {copy.title}</h1>
          <p className="quiz-result-reason">{copy.reason}</p>
          <ul className="quiz-points">
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="quiz-actions">
            <Link className="primary-action" to="/calculator/standard">
              去用对应计算器 →
            </Link>
            <Link className="secondary-action" to="/questionnaire">
              做深度评估，算出详细数字
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <section className="quiz-card">
        <div className="quiz-topline">
          <button type="button" onClick={goBack} disabled={index === 0}>
            ← 上一题
          </button>
          <span>
            {index + 1} / {questions.length}
          </span>
        </div>
        <div className="quiz-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="quiz-kicker">快速测试</p>
        <h1>{current.title}</h1>
        {current.hint && <p className="quiz-hint">{current.hint}</p>}
        {current.type === "number" ? (
          <>
            <QuizNumberInput
              question={current}
              value={getCurrentAnswer(current, answers)}
              onChange={setNumberAnswer}
            />
            <button className="quiz-next-button" type="button" onClick={goNext}>
              下一题 →
            </button>
          </>
        ) : (
          <div className="quiz-options">
            {current.options.map((option) => (
              <button
                className={pendingOption === option || answers[current.id] === option ? "selected" : ""}
                disabled={!!pendingOption}
                key={option}
                onClick={() => choose(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function QuizNumberInput({ question, value, onChange }) {
  const update = (nextValue) => {
    onChange(Math.min(question.max, Math.max(question.min, nextValue)));
  };

  return (
    <div className="quiz-number-wrap">
      <div className="quiz-number-row">
        <button className="quiz-number-button" type="button" onClick={() => update(value - (question.step || 1))}>
          −
        </button>
        <div className="quiz-number-display">
          <div className="quiz-number-value">{value}</div>
          <div className="quiz-number-unit">{question.unit}</div>
        </div>
        <button className="quiz-number-button" type="button" onClick={() => update(value + (question.step || 1))}>
          +
        </button>
      </div>
    </div>
  );
}

function getCurrentAnswer(question, answers) {
  return answers[question.id] ?? question.defaultValue;
}

function getMappedValue(options, option, values) {
  const index = options.indexOf(option);
  return index >= 0 ? values[index] : undefined;
}

function getQuizSharedData(answers) {
  return {
    age: Number(answers.age) || questions[0].defaultValue,
    fire_age: Number(answers.retireAge) || questions[1].defaultValue,
    financial_assets: (Number(answers.assets) || questions[2].defaultValue) * 10000,
    monthly_income: Number(answers.income) || questions[3].defaultValue,
    retire_expense: getMappedValue(questions[4].options, answers.spending, [3000, 6000, 12000, 25000, 40000]),
  };
}

function getResult(answers) {
  const highSavings = isHighSavings(answers.income, answers.spending);
  const highIncome = Number(answers.income) >= 35000;
  const hasAssets = Number(answers.assets) >= 50;
  const young = Number(answers.age) <= 30;

  if (answers.lifestyle === "做点喜欢的事或兼职，不完全靠投资" || answers.workState === "做份轻松的兼职，保持社交") return "Barista";
  if (answers.lifestyle === "比现在更好，旅行美食不将就" && highIncome) return "Fat";
  if (answers.lifestyle === "能不工作就行，支出越低越好" && highSavings) return "Lean";
  if (young && hasAssets) return "Coast";
  return "Regular";
}

function isHighSavings(income, spending) {
  const monthlyIncome = Number(income) || 0;
  const incomeRank = monthlyIncome >= 80000 ? 4 : monthlyIncome >= 40000 ? 3 : monthlyIncome >= 20000 ? 2 : monthlyIncome >= 10000 ? 1 : 0;
  const spendingRank = ["5万以下", "5-10万", "10-20万", "20-40万", "40万以上"].indexOf(spending);
  return incomeRank >= 2 && spendingRank <= 1;
}
