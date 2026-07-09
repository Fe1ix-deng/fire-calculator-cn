import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppData } from "../AppContext.jsx";

const currentYear = new Date().getFullYear();
const FIRE_SEARCH_MONTH_LIMIT = 1200;
const UNREACHABLE_FIRE_MESSAGE = "按当前储蓄率与收益率，长期内难以达到 FIRE 目标，建议提高储蓄率或下调目标支出";

const presets = [
  {
    id: "conservative",
    icon: "🐢",
    name: "保守型",
    desc: "储蓄率15%，实际收益率2%，提取率3.5%",
    values: { monthlyIncome: 30000, savingsRate: 15, annualReturn: 2, withdrawalRate: 3.5 },
  },
  {
    id: "steady",
    icon: "📈",
    name: "稳健型",
    desc: "储蓄率25%，实际收益率3%，提取率4%",
    values: { monthlyIncome: 30000, savingsRate: 25, annualReturn: 3, withdrawalRate: 4 },
  },
  {
    id: "aggressive",
    icon: "🚀",
    name: "积极型",
    desc: "储蓄率40%，实际收益率4%，提取率4%",
    values: { monthlyIncome: 30000, savingsRate: 40, annualReturn: 4, withdrawalRate: 4 },
  },
  {
    id: "fat",
    icon: "💎",
    name: "富裕退休",
    desc: "高收入高支出，实际收益率3%，提取率3%",
    values: { monthlyIncome: 50000, savingsRate: 40, retirementMonthlyExpense: 22000, annualReturn: 3, withdrawalRate: 3 },
  },
];

const initialValues = {
  age: 32,
  targetRetirementAge: 50,
  currentAssets: 300000,
  monthlyIncome: 0,
  savingsRate: 30,
  retirementMonthlyExpense: 10000,
  annualReturn: 4,
  withdrawalRate: 4,
  monthlyPension: 0,
  includePropertyEquity: false,
  propertyEquity: 0,
};

export default function StandardFire() {
  const { sharedData } = useAppData();
  const [values, setValues] = useState(() => getInitialValues(sharedData));
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
          <span>当前资产：{formatMoney(result.totalStartingAssets)}</span>
          <span>FIRE 目标：{formatMoney(result.fireTarget)}</span>
        </div>
        <p className="progress-note">
          {result.isFireReady
            ? "你现在就可以退休了"
            : result.isUnreachable
              ? UNREACHABLE_FIRE_MESSAGE
            : `还需 ${result.yearsToFire} 年 ${result.monthsToFire} 个月，预计 ${result.fireYear} 年实现`}
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
            <NumberField
              label="目标退休年龄"
              unit="岁"
              value={values.targetRetirementAge}
              hint="用于与实际测算结果对比，不影响计算"
              onChange={(value) => update("targetRetirementAge", value)}
            />
            <NumberField
              label="当前金融资产"
              unit="元"
              value={values.currentAssets}
              hint="💡 如有公积金账户余额，可一并计入上方金融资产"
              onChange={(value) => update("currentAssets", value)}
            />
            <NumberField
              label="税后月收入"
              unit="元/月"
              value={values.monthlyIncome}
              onChange={(value) => update("monthlyIncome", value)}
            />
            <SavingsRateField
              monthlyIncome={toNumber(values.monthlyIncome)}
              value={values.savingsRate}
              onChange={(value) => update("savingsRate", value)}
            />
            <NumberField
              label="退休后月支出"
              unit="元/月"
              value={values.retirementMonthlyExpense}
              hint="通常为当前月支出的70%-100%，可根据理想生活自行调整"
              onChange={(value) => update("retirementMonthlyExpense", value)}
            />
            <SliderField
              label="预期实际年化收益率"
              min={1}
              max={25}
              value={values.annualReturn}
              hint="已扣除通胀，即真实购买力的年增长率"
              onChange={(value) => update("annualReturn", value)}
            />
            <SliderField label="安全提取率" min={2} max={6} value={values.withdrawalRate} onChange={(value) => update("withdrawalRate", value)} />
          </div>

          <button className="china-toggle" type="button" onClick={() => setChinaOpen((open) => !open)}>
            {chinaOpen ? "−" : "+"} 补充信息（可选）
          </button>
          {chinaOpen && (
            <div className="fire-form china-form">
              <NumberField label="预计月养老金" unit="元" value={values.monthlyPension} onChange={(value) => update("monthlyPension", value)} />
              <PropertyEquityField
                checked={values.includePropertyEquity}
                value={values.propertyEquity}
                onCheckedChange={(checked) => update("includePropertyEquity", checked)}
                onValueChange={(value) => update("propertyEquity", value)}
              />
            </div>
          )}
        </div>

        <div className="result-stack">
          <div className="metric-cards">
            <MetricCard label="FIRE目标金额" value={formatWan(result.fireTarget)} accent />
            <MetricCard
              label="距离FIRE年数"
              value={result.isFireReady ? "现在可退休" : result.isUnreachable ? "难以达成" : `${result.totalYearsToFire} 年`}
            />
            <MetricCard label="当前储蓄率" value={formatOptionalPercent(result.savingsRate)} />
          </div>
          <GoalComparisonCard targetAge={toNumber(values.targetRetirementAge)} actualAge={result.fireAge} isUnreachable={result.isUnreachable} />
          <div className="fire-card explanation-card inline-explanation">
            <h2>读懂你的结果</h2>
            {result.isPensionCovered ? (
              <p>你的养老金已可覆盖退休支出，理论上无需额外积累。</p>
            ) : result.isFireReady ? (
              <p>
                你的当前资产已经达到 FIRE 目标金额 {formatWan(result.fireTarget)}。按当前资产和退休后每月支出{" "}
                {formatMoney(values.retirementMonthlyExpense)} 测算，{result.withdrawalText}。
              </p>
            ) : result.isUnreachable ? (
              <p>{UNREACHABLE_FIRE_MESSAGE}。</p>
            ) : (
              <p>
                你的 FIRE 目标金额为 {formatWan(result.fireTarget)}。按当前储蓄率 {values.savingsRate}%、
                每月储蓄 {formatMoney(result.monthlySavings)}、实际收益率 {formatPercent(result.realAnnualReturn * 100)} 计算，预计在{" "}
                {result.fireAge} 岁（{result.fireYear} 年）实现财务自由，还需要 {result.yearsToFire} 年{" "}
                {result.monthsToFire} 个月。
                <span className="sustainability-note">
                  {result.isPerpetual
                    ? "退休后本金预计可永续（实际收益率≥提取率）"
                    : `退休后本金将随时间消耗，提取率${result.withdrawalRate}%高于实际收益率，需留意长寿风险`}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="fire-card chart-card">
        <h2>{result.chartMode === "retirement" ? "退休后资产变化预测" : "资产增长预测"}</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
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
              <Line
                type="monotone"
                dataKey="inflationAdjusted"
                name="实际购买力"
                stroke="#2563EB"
                strokeWidth={2.5}
                strokeDasharray="7 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="fireTarget"
                name="FIRE目标"
                stroke="#D3452F"
                strokeWidth={2.5}
                strokeDasharray="6 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-note chart-note-text">
          <span className="fire-target-key" />
          蓝线为你的资产实际购买力（按今日物价折算），当蓝线触碰红线时即达到FIRE目标。
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
          onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
        />
        <small>{unit}</small>
      </div>
      {hint && <em>{hint}</em>}
    </label>
  );
}

function SliderField({ label, min, max, value, hint, onChange }) {
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
      {hint && <em>{hint}</em>}
    </label>
  );
}

function SavingsRateField({ monthlyIncome, value, onChange }) {
  const savings = monthlyIncome * (toNumber(value) / 100);
  const spending = Math.max(0, monthlyIncome - savings);

  return (
    <label className="fire-field slider-field savings-rate-field">
      <span>
        储蓄率
        <strong>{value}%</strong>
      </span>
      <input
        type="range"
        min="0"
        max="80"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="slider-ends">
        <small>0%</small>
        <small>80%</small>
      </div>
      <em>即每月储蓄 {formatMoney(savings)}，每月支出 {formatMoney(spending)}</em>
    </label>
  );
}

function PropertyEquityField({ checked, value, onCheckedChange, onValueChange }) {
  return (
    <div className="property-equity-field">
      <label className="property-equity-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
        />
        <span>我计划退休后出售房产，将净值纳入可用资产</span>
      </label>
      {checked && (
        <NumberField
          label="房产净值（市值 − 剩余房贷）"
          unit="元"
          value={value}
          hint="仅建议确定会出售自住房的用户填写"
          onChange={onValueChange}
        />
      )}
    </div>
  );
}

function GoalComparisonCard({ targetAge, actualAge, isUnreachable = false }) {
  const yearsBehind = isUnreachable ? 0 : Math.max(0, actualAge - targetAge);
  const onTrack = !isUnreachable && actualAge <= targetAge;

  return (
    <div className="fire-card goal-comparison-card">
      <div className="goal-ages">
        <div>
          <span>你的目标</span>
          <strong>{targetAge}岁</strong>
        </div>
        <div>
          <span>按当前数据</span>
          <strong>{isUnreachable ? "难以达成" : `${actualAge}岁`}</strong>
        </div>
      </div>
      <p className={onTrack ? "goal-status on-track" : "goal-status behind"}>
        {isUnreachable ? "当前路径长期内难以达到目标" : onTrack ? "✓ 你有望提前达成目标" : `还需努力 ${yearsBehind} 年才能达到目标`}
      </p>
    </div>
  );
}

function getInitialValues(sharedData = {}) {
  const monthlyIncome = getSharedNumber(sharedData.monthly_income, initialValues.monthlyIncome);
  const sharedMonthlySavings = Number(sharedData.monthly_savings);
  const sharedHousingFund = getSharedNumber(sharedData.gjj_balance, 0);
  const sharedPropertyNet = getSharedNumber(sharedData.property_net, initialValues.propertyEquity);
  const savingsRate = monthlyIncome > 0 && Number.isFinite(sharedMonthlySavings)
    ? Math.round(Math.min(80, Math.max(0, (sharedMonthlySavings / monthlyIncome) * 100)))
    : initialValues.savingsRate;

  return {
    ...initialValues,
    age: getSharedNumber(sharedData.age, initialValues.age),
    targetRetirementAge: getSharedNumber(sharedData.fire_age, initialValues.targetRetirementAge),
    currentAssets: getSharedNumber(sharedData.financial_assets, initialValues.currentAssets) + sharedHousingFund,
    monthlyIncome,
    savingsRate,
    retirementMonthlyExpense: getSharedNumber(sharedData.retire_expense, initialValues.retirementMonthlyExpense),
    annualReturn: getSharedNumber(sharedData.expected_return, initialValues.annualReturn),
    monthlyPension: getSharedNumber(sharedData.pension_monthly, initialValues.monthlyPension),
    includePropertyEquity: false,
    propertyEquity: sharedPropertyNet,
  };
}

function getSharedNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
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
  const numericValues = {
    age: toNumber(values.age),
    currentAssets: toNumber(values.currentAssets),
    monthlyIncome: toNumber(values.monthlyIncome),
    savingsRate: toNumber(values.savingsRate),
    retirementMonthlyExpense: toNumber(values.retirementMonthlyExpense),
    annualReturn: toNumber(values.annualReturn),
    withdrawalRate: toNumber(values.withdrawalRate),
    monthlyPension: toNumber(values.monthlyPension),
    includePropertyEquity: Boolean(values.includePropertyEquity),
    propertyEquity: toNumber(values.propertyEquity),
  };
  const monthlySavings = numericValues.monthlyIncome * (numericValues.savingsRate / 100);
  const monthlyGap = Math.max(0, numericValues.retirementMonthlyExpense - numericValues.monthlyPension);
  const annualGap = monthlyGap * 12;
  const fireTarget = numericValues.withdrawalRate > 0 ? annualGap / (numericValues.withdrawalRate / 100) : 0;
  const totalStartingAssets = numericValues.currentAssets + (numericValues.includePropertyEquity ? numericValues.propertyEquity : 0);
  const progressPercent = fireTarget > 0 ? Math.min(100, (totalStartingAssets / fireTarget) * 100) : 100;
  const isFireReady = totalStartingAssets >= fireTarget;
  const isPensionCovered = monthlyGap <= 0;
  const realAnnualReturn = numericValues.annualReturn / 100;
  const isPerpetual = realAnnualReturn >= numericValues.withdrawalRate / 100;
  const realMonthlyReturn = Math.pow(1 + realAnnualReturn, 1 / 12) - 1;
  const monthsToFire = isFireReady ? 0 : findMonthsToFire(totalStartingAssets, monthlySavings, fireTarget, realMonthlyReturn);
  const isUnreachable = !isFireReady && monthsToFire >= FIRE_SEARCH_MONTH_LIMIT;
  const totalYearsToFire = Math.floor(monthsToFire / 12);
  const remainingMonths = monthsToFire % 12;
  const yearsRounded = Math.round(monthsToFire / 12);
  const fireAge = numericValues.age + yearsRounded;
  const fireYear = currentYear + yearsRounded;
  const savingsRate = numericValues.monthlyIncome > 0 ? monthlySavings / numericValues.monthlyIncome : null;
  const withdrawal = estimateWithdrawalYears(totalStartingAssets, annualGap, realAnnualReturn);
  const chartData = isFireReady
    ? buildRetirementChartData(numericValues, totalStartingAssets)
    : buildAccumulationChartData(
      { ...numericValues, monthlySavings },
      totalStartingAssets,
      fireTarget,
      isUnreachable ? numericValues.age + FIRE_SEARCH_MONTH_LIMIT / 12 : fireAge
    );

  return {
    monthlyGap,
    monthlySavings,
    fireTarget,
    withdrawalRate: numericValues.withdrawalRate,
    totalStartingAssets,
    progressPercent,
    realAnnualReturn,
    isPerpetual,
    isFireReady,
    isUnreachable,
    isPensionCovered,
    chartMode: isFireReady ? "retirement" : "accumulation",
    yearsToFire: totalYearsToFire,
    monthsToFire: remainingMonths,
    totalYearsToFire,
    fireAge: isUnreachable ? null : fireAge,
    fireYear: isUnreachable ? null : fireYear,
    savingsRate,
    withdrawalYears: withdrawal.years,
    withdrawalText: withdrawal.text,
    chartData,
  };
}

function findMonthsToFire(startingAssets, monthlySavings, target, monthlyReturn) {
  if (startingAssets >= target) return 0;
  if (monthlySavings <= 0 && monthlyReturn <= 0) return FIRE_SEARCH_MONTH_LIMIT;

  let assets = startingAssets;
  for (let month = 1; month <= FIRE_SEARCH_MONTH_LIMIT; month += 1) {
    assets = assets * (1 + monthlyReturn) + monthlySavings;
    if (assets >= target) return month;
  }
  return FIRE_SEARCH_MONTH_LIMIT;
}

function buildAccumulationChartData(values, startingAssets, fireTarget, fireAge) {
  const endAge = Math.min(100, Math.max(values.age + 10, fireAge + 10));
  const rows = [];
  let realAssets = startingAssets;
  const realMonthlyReturn = Math.pow(1 + values.annualReturn / 100, 1 / 12) - 1;

  for (let age = values.age; age <= endAge; age += 1) {
    rows.push({
      age,
      inflationAdjusted: Math.round(realAssets),
      fireTarget,
    });

    for (let month = 0; month < 12; month += 1) {
      realAssets = realAssets * (1 + realMonthlyReturn) + values.monthlySavings;
    }
  }

  return rows;
}

function buildRetirementChartData(values, startingAssets) {
  const rows = [];
  let realAssets = startingAssets;
  const realAnnualReturn = values.annualReturn / 100;
  const realMonthlyReturn = Math.pow(1 + realAnnualReturn, 1 / 12) - 1;
  const monthlyWithdrawal = Math.max(0, values.retirementMonthlyExpense - values.monthlyPension);

  for (let age = values.age; age <= 100; age += 1) {
    rows.push({
      age,
      inflationAdjusted: Math.max(0, Math.round(realAssets)),
      fireTarget: Math.max(0, values.withdrawalRate > 0 ? (monthlyWithdrawal * 12) / (values.withdrawalRate / 100) : 0),
    });

    if (realAssets <= 0) break;

    for (let month = 0; month < 12; month += 1) {
      realAssets = realAssets * (1 + realMonthlyReturn) - monthlyWithdrawal;
      if (realAssets <= 0) break;
    }
  }

  return rows;
}

function estimateWithdrawalYears(startingAssets, annualExpense, realAnnualReturn) {
  if (annualExpense <= 0) return { years: 99, text: "可持续：无限期" };
  if (realAnnualReturn > 0 && startingAssets * realAnnualReturn > annualExpense) {
    return { years: Infinity, text: "可持续：无限期" };
  }

  let assets = startingAssets;
  for (let year = 1; year <= 99; year += 1) {
    assets = assets * (1 + realAnnualReturn) - annualExpense;
    if (assets <= 0) return { years: year, text: `可持续：${year}年` };
  }
  return { years: 99, text: "可持续：99年以上" };
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
