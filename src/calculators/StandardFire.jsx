import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currentYear = new Date().getFullYear();

const presets = [
  {
    id: "conservative",
    icon: "🐢",
    name: "保守型",
    desc: "储蓄率15%，收益率5%，提取率3.5%",
    values: { monthlyIncome: 30000, monthlySavings: 4500, annualReturn: 5, withdrawalRate: 3.5 },
  },
  {
    id: "steady",
    icon: "📈",
    name: "稳健型",
    desc: "储蓄率25%，收益率6%，提取率4%",
    values: { monthlyIncome: 30000, monthlySavings: 7500, annualReturn: 6, withdrawalRate: 4 },
  },
  {
    id: "aggressive",
    icon: "🚀",
    name: "积极型",
    desc: "储蓄率40%，收益率7%，提取率4%",
    values: { monthlyIncome: 30000, monthlySavings: 12000, annualReturn: 7, withdrawalRate: 4 },
  },
  {
    id: "fat",
    icon: "💎",
    name: "富裕退休",
    desc: "高收入高支出，收益率6%，提取率3%",
    values: { monthlyIncome: 50000, monthlySavings: 20000, retirementMonthlyExpense: 22000, annualReturn: 6, withdrawalRate: 3 },
  },
];

const initialValues = {
  age: 32,
  targetRetirementAge: 50,
  currentAssets: 300000,
  monthlyIncome: 0,
  monthlySavings: 8000,
  retirementMonthlyExpense: 10000,
  annualReturn: 6,
  inflationRate: 3,
  withdrawalRate: 4,
  monthlyPension: 0,
  housingFundBalance: 0,
  propertyEquity: 0,
};

export default function StandardFire() {
  const [values, setValues] = useState(initialValues);
  const [chinaOpen, setChinaOpen] = useState(false);

  const result = useMemo(() => calculateFire(values), [values]);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const applyPreset = (preset) => {
    setValues((current) => ({ ...current, ...preset.values }));
  };

  return (
    <main className="standard-fire-page">
      <section className="fire-card progress-card">
        <div className="progress-heading">
          <h1>距离 FIRE 的进度</h1>
          <span>{formatPercent(result.progressPercent)}</span>
        </div>
        <div className="progress-bar" aria-label="距离 FIRE 的进度">
          <span style={{ width: `${Math.min(100, result.progressPercent)}%` }} />
        </div>
        <div className="progress-money">
          <span>当前资产：{formatMoney(values.currentAssets + values.housingFundBalance + values.propertyEquity)}</span>
          <span>FIRE 目标：{formatMoney(result.fireTarget)}</span>
        </div>
        <p className="progress-note">
          还需 {result.yearsToFire} 年 {result.monthsToFire} 个月，预计 {result.fireYear} 年实现
        </p>
      </section>

      <section className="preset-row" aria-label="快捷预设">
        {presets.map((preset) => (
          <button className="preset-button" key={preset.id} onClick={() => applyPreset(preset)}>
            <strong>
              <span>{preset.icon}</span>
              {preset.name}
            </strong>
            <small>{preset.desc}</small>
          </button>
        ))}
      </section>

      <section className="fire-main-grid">
        <div className="fire-card input-card">
          <h2>你的信息</h2>
          <div className="fire-form">
            <NumberField label="当前年龄" unit="岁" value={values.age} onChange={(value) => update("age", value)} />
            <NumberField label="目标退休年龄" unit="岁" value={values.targetRetirementAge} onChange={(value) => update("targetRetirementAge", value)} />
            <NumberField label="当前金融资产" unit="元" value={values.currentAssets} onChange={(value) => update("currentAssets", value)} />
            <NumberField
              label="每月储蓄额"
              unit="元/月"
              value={values.monthlySavings}
              hint="月收入减去月支出"
              onChange={(value) => update("monthlySavings", value)}
            />
            <NumberField
              label="税后月收入"
              unit="元/月"
              value={values.monthlyIncome}
              onChange={(value) => update("monthlyIncome", value)}
            />
            <NumberField
              label="退休后月支出"
              unit="元/月"
              value={values.retirementMonthlyExpense}
              hint="用今天的物价估算"
              onChange={(value) => update("retirementMonthlyExpense", value)}
            />
            <SliderField label="预期年化收益率" min={1} max={12} value={values.annualReturn} onChange={(value) => update("annualReturn", value)} />
            <SliderField label="预期通胀率" min={1} max={8} value={values.inflationRate} onChange={(value) => update("inflationRate", value)} />
            <SliderField label="安全提取率" min={2} max={6} value={values.withdrawalRate} onChange={(value) => update("withdrawalRate", value)} />
          </div>

          <button className="china-toggle" type="button" onClick={() => setChinaOpen((open) => !open)}>
            {chinaOpen ? "−" : "+"} 中国特有变量（可选）
          </button>
          {chinaOpen && (
            <div className="fire-form china-form">
              <NumberField label="预计月养老金" unit="元" value={values.monthlyPension} onChange={(value) => update("monthlyPension", value)} />
              <NumberField label="公积金余额" unit="元" value={values.housingFundBalance} onChange={(value) => update("housingFundBalance", value)} />
              <NumberField label="房产净值" unit="元" value={values.propertyEquity} onChange={(value) => update("propertyEquity", value)} />
            </div>
          )}
        </div>

        <div className="result-stack">
          <div className="metric-cards">
            <MetricCard label="FIRE目标金额" value={formatWan(result.fireTarget)} accent />
            <MetricCard label="距离FIRE年数" value={`${result.totalYearsToFire} 年`} />
            <MetricCard label="当前储蓄率" value={formatOptionalPercent(result.savingsRate)} />
          </div>
          <div className="fire-card explanation-card inline-explanation">
            <h2>读懂你的结果</h2>
            <p>
              你的 FIRE 目标金额为 {formatWan(result.fireTarget)}。按当前每月储蓄 {formatMoney(values.monthlySavings)}、
              年化收益率 {values.annualReturn}% 计算，预计在 {result.fireAge} 岁（{result.fireYear} 年）实现财务自由，
              还需要 {result.yearsToFire} 年 {result.monthsToFire} 个月。届时按每月{" "}
              {formatMoney(values.retirementMonthlyExpense)} 提取，可持续约 {result.withdrawalYears} 年。
            </p>
          </div>
        </div>
      </section>

      <section className="fire-card chart-card">
        <h2>资产增长预测</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={result.chartData} margin={{ top: 20, right: 22, bottom: 16, left: 6 }}>
              <CartesianGrid stroke="#E8E0D4" strokeDasharray="3 3" />
              <XAxis dataKey="age" tickLine={false} axisLine={{ stroke: "#E8E0D4" }} />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#E8E0D4" }}
                tickFormatter={(value) => `${Math.round(value / 10000)}万`}
              />
              <Tooltip formatter={(value) => `${formatWan(value)}`} labelFormatter={(label) => `${label} 岁`} />
              <Legend verticalAlign="bottom" height={32} />
              <ReferenceLine
                y={result.fireTarget}
                stroke="#D3452F"
                strokeDasharray="6 5"
                label={{ value: "FIRE目标", fill: "#D3452F", position: "insideTopRight" }}
              />
              <Line
                type="monotone"
                dataKey="portfolioValue"
                name="名义资产值"
                stroke="#C05C0A"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="inflationAdjusted"
                name="通胀调整后购买力"
                stroke="#2563EB"
                strokeWidth={2.5}
                strokeDasharray="7 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

    </main>
  );
}

function NumberField({ label, unit, value, hint, onChange }) {
  return (
    <label className="fire-field">
      <span>{label}</span>
      <div className="number-control">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
        />
        <small>{unit}</small>
      </div>
      {hint && <em>{hint}</em>}
    </label>
  );
}

function SliderField({ label, min, max, value, onChange }) {
  return (
    <label className="fire-field slider-field">
      <span>
        {label}
        <strong>{value}%</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="slider-ends">
        <small>{min}%</small>
        <small>{max}%</small>
      </div>
    </label>
  );
}

function MetricCard({ label, value, accent = false }) {
  return (
    <div className={accent ? "metric-card accent" : "metric-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function calculateFire(values) {
  const monthlyGap = Math.max(0, values.retirementMonthlyExpense - values.monthlyPension);
  const annualGap = monthlyGap * 12;
  const fireTarget = values.withdrawalRate > 0 ? annualGap / (values.withdrawalRate / 100) : 0;
  const totalStartingAssets = values.currentAssets + values.housingFundBalance + values.propertyEquity;
  const progressPercent = fireTarget > 0 ? Math.min(100, (totalStartingAssets / fireTarget) * 100) : 100;
  const monthlyReturn = Math.pow(1 + values.annualReturn / 100, 1 / 12) - 1;
  const monthsToFire = findMonthsToFire(totalStartingAssets, values.monthlySavings, fireTarget, monthlyReturn);
  const totalYearsToFire = Math.floor(monthsToFire / 12);
  const remainingMonths = monthsToFire % 12;
  const fireAge = values.age + totalYearsToFire + Math.round(remainingMonths / 12);
  const fireYear = currentYear + totalYearsToFire + Math.ceil(remainingMonths / 12);
  const savingsRate = values.monthlyIncome > 0 ? values.monthlySavings / values.monthlyIncome : null;
  const withdrawalYears = estimateWithdrawalYears(fireTarget, annualGap, values.annualReturn / 100);
  const chartData = buildChartData(values, totalStartingAssets, fireTarget);

  return {
    monthlyGap,
    fireTarget,
    totalStartingAssets,
    progressPercent,
    yearsToFire: totalYearsToFire,
    monthsToFire: remainingMonths,
    totalYearsToFire,
    fireAge,
    fireYear,
    savingsRate,
    withdrawalYears,
    chartData,
  };
}

function findMonthsToFire(startingAssets, monthlySavings, target, monthlyReturn) {
  if (startingAssets >= target) return 0;
  if (monthlySavings <= 0 && monthlyReturn <= 0) return 1200;

  let assets = startingAssets;
  for (let month = 1; month <= 1200; month += 1) {
    assets = assets * (1 + monthlyReturn) + monthlySavings;
    if (assets >= target) return month;
  }
  return 1200;
}

function buildChartData(values, startingAssets, fireTarget) {
  const endAge = values.targetRetirementAge + 10;
  const rows = [];
  let assets = startingAssets;

  for (let age = values.age; age <= endAge; age += 1) {
    const years = age - values.age;
    rows.push({
      age,
      portfolioValue: Math.round(assets),
      inflationAdjusted: Math.round(assets / Math.pow(1 + values.inflationRate / 100, years)),
      fireTarget,
    });

    for (let month = 0; month < 12; month += 1) {
      assets = assets * (1 + values.annualReturn / 100 / 12) + values.monthlySavings;
    }
  }

  return rows;
}

function estimateWithdrawalYears(startingAssets, annualExpense, annualReturn) {
  if (annualExpense <= 0) return 99;
  let assets = startingAssets;
  for (let year = 1; year <= 99; year += 1) {
    assets = assets * (1 + annualReturn) - annualExpense;
    if (assets <= 0) return year;
  }
  return 99;
}

function formatMoney(value) {
  return `${Math.round(value).toLocaleString("zh-CN")} 元`;
}

function formatWan(value) {
  return `${Number((value / 10000).toFixed(1)).toLocaleString("zh-CN")} 万`;
}

function formatPercent(value) {
  return `${Number(value.toFixed(1))}%`;
}

function formatOptionalPercent(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return formatPercent(value * 100);
}
