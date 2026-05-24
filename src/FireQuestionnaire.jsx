import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F4EFE6;
  --card: #FFFFFF;
  --text: #1C1814;
  --text-2: #7A6F65;
  --text-3: #B0A89E;
  --accent: #C05C0A;
  --accent-bg: #FEF3EA;
  --accent-border: #F0C49A;
  --border: #E8E0D4;
  --green: #2A6049;
  --green-bg: #EAF4EF;
  --shadow: 0 2px 20px rgba(0,0,0,0.07);
  --r: 14px;
}

html, body { height: 100%; background: var(--bg); }

body {
  font-family: 'DM Sans', -apple-system, 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 10px;
}

/* ─── Header ─────────────── */
.hdr {
  position: sticky; top: 0; z-index: 20;
  background: rgba(244,239,230,0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 14px 20px 12px;
  border-bottom: 1px solid var(--border);
}
.hdr-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 9px;
}
.mod-chip {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  padding: 3px 9px;
  border-radius: 20px;
}
.hdr-count {
  font-size: 12px;
  color: var(--text-3);
  font-weight: 500;
}
.bar-track {
  height: 3px;
  background: var(--border);
  border-radius: 99px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #E8893A);
  border-radius: 99px;
  transition: width 0.45s cubic-bezier(.4,0,.2,1);
}

/* ─── Question area ──────── */
.q-wrap {
  padding: 30px 20px 120px;
  flex: 1;
}
.q-text {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.55;
  color: var(--text);
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}
.q-hint {
  font-size: 13px;
  line-height: 1.55;
  color: var(--accent);
  background: var(--accent-bg);
  border-left: 3px solid var(--accent-border);
  padding: 9px 13px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 22px;
}

/* ─── Single select ──────── */
.opts { display: flex; flex-direction: column; gap: 9px; margin-top: 4px; }
.opt {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: var(--r);
  padding: 14px 16px;
  text-align: left;
  width: 100%;
  font-size: 15px;
  line-height: 1.4;
  color: var(--text);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.opt:active { transform: scale(0.985); }
.opt.sel {
  border-color: var(--accent);
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 500;
}

/* ─── Multi select ───────── */
.m-opt {
  display: flex;
  align-items: center;
  gap: 12px;
}
.chk {
  width: 21px; height: 21px;
  border-radius: 6px;
  border: 1.5px solid var(--border);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  font-size: 13px;
  color: transparent;
}
.opt.sel .chk {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}
.max-hint {
  font-size: 12px;
  color: var(--text-3);
  text-align: center;
  margin-top: 6px;
}

/* ─── Number input ───────── */
.num-wrap {
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.num-row {
  display: flex;
  align-items: center;
  gap: 24px;
}
.num-btn {
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--card);
  font-size: 26px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-2);
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}
.num-btn:active {
  background: var(--accent-bg);
  border-color: var(--accent);
  color: var(--accent);
}
.num-val {
  font-family: 'Noto Serif SC', serif;
  font-size: 64px;
  font-weight: 600;
  color: var(--text);
  line-height: 1;
  min-width: 120px;
  text-align: center;
}
.num-unit {
  font-size: 17px;
  color: var(--text-2);
  font-weight: 400;
}

/* ─── Slider ─────────────── */
.sld-wrap { margin-top: 28px; }
.sld-val {
  font-family: 'Noto Serif SC', serif;
  font-size: 44px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.sld-val span { font-size: 18px; font-weight: 400; color: var(--text-2); }
input[type=range] {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 6px;
  border-radius: 99px;
  background: var(--border);
  outline: none;
  margin: 20px 0 8px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(192,92,10,0.35);
}
input[type=range]::-moz-range-thumb {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
}
.sld-ends {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-3);
}

/* ─── Expense table ──────── */
.exp-list { margin-top: 8px; display: flex; flex-direction: column; gap: 7px; }
.exp-row {
  display: flex; align-items: center; gap: 10px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 14px;
}
.exp-lbl { flex: 1; font-size: 14px; color: var(--text); }
.exp-inp {
  width: 88px;
  text-align: right;
  font-size: 15px; font-weight: 500;
  border: none; outline: none;
  background: transparent;
  color: var(--text);
  font-family: inherit;
}
.exp-inp::placeholder { color: var(--text-3); font-weight: 400; }
.exp-unit { font-size: 13px; color: var(--text-3); }
.exp-total {
  background: var(--accent-bg);
  border: 1.5px solid var(--accent-border);
  border-radius: 10px;
  padding: 13px 14px;
  margin-top: 4px;
  display: flex; justify-content: space-between; align-items: center;
}
.exp-total-lbl { font-size: 13px; font-weight: 600; color: var(--accent); }
.exp-total-val {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px; font-weight: 600;
  color: var(--accent);
}
.savings-note {
  background: var(--green-bg);
  border-radius: 8px;
  padding: 10px 13px;
  margin-top: 7px;
  font-size: 13px;
  color: var(--green);
  line-height: 1.5;
}

/* ─── Allocation ─────────── */
.alloc-list { margin-top: 10px; display: flex; flex-direction: column; gap: 7px; }
.alloc-row {
  display: flex; align-items: center; gap: 10px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 14px;
}
.alloc-lbl { flex: 1; font-size: 14px; }
.alloc-inp {
  width: 52px; text-align: right;
  font-size: 15px; font-weight: 500;
  border: none; outline: none;
  background: transparent;
  color: var(--text); font-family: inherit;
}
.alloc-sum {
  margin-top: 7px;
  text-align: right;
  font-size: 13px;
  padding: 8px 13px;
  border-radius: 8px;
}
.alloc-sum.ok { color: var(--green); background: var(--green-bg); }
.alloc-sum.warn { color: var(--accent); background: var(--accent-bg); }

/* ─── FIRE type cards ────── */
.fire-list { margin-top: 8px; display: flex; flex-direction: column; gap: 9px; }
.fire-card {
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: var(--r);
  padding: 15px 16px;
  cursor: pointer; text-align: left; width: 100%;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}
.fire-card:active { transform: scale(0.985); }
.fire-card.sel {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.fire-name {
  font-weight: 600; font-size: 15px;
  color: var(--text); margin-bottom: 4px;
}
.fire-card.sel .fire-name { color: var(--accent); }
.fire-desc { font-size: 13px; color: var(--text-2); line-height: 1.45; }

/* ─── Custom return ─────── */
.custom-return {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}
.custom-return input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text);
  font-size: 16px;
  font-family: inherit;
}
.custom-return span {
  font-size: 14px;
  color: var(--text-3);
}

/* ─── Bottom nav ─────────── */
.nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(244,239,230,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  padding: 14px 20px;
  padding-bottom: max(14px, env(safe-area-inset-bottom));
  display: flex; gap: 10px;
  max-width: 480px; margin: 0 auto;
}
.btn-back {
  width: 52px; height: 52px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--card);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: var(--text-2);
  flex-shrink: 0;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.btn-back:disabled { opacity: 0.25; cursor: default; }
.btn-back:not(:disabled):active { background: var(--border); }
.btn-next {
  flex: 1; height: 52px;
  border-radius: 12px; border: none;
  background: var(--accent);
  color: white;
  font-size: 16px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: opacity 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}
.btn-next:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-next:not(:disabled):active { transform: scale(0.98); opacity: 0.9; }

/* ─── Done screen ────────── */
.done-wrap {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 24px 120px;
  text-align: center; gap: 18px;
}
.done-icon { font-size: 72px; line-height: 1; }
.done-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px; font-weight: 600;
  line-height: 1.4;
}
.done-sub {
  font-size: 15px; color: var(--text-2);
  line-height: 1.65; max-width: 300px;
}
.done-card {
  width: 100%; max-width: 340px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 18px 20px;
  text-align: left;
}
.done-card-title {
  font-weight: 600; font-size: 14px;
  margin-bottom: 10px; color: var(--text);
}
.done-item {
  display: flex; align-items: flex-start;
  gap: 10px; font-size: 14px;
  color: var(--text-2); line-height: 1.5;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
}
.done-item:last-child { border-bottom: none; }
.done-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); flex-shrink: 0; margin-top: 6px;
}
.btn-generate {
  width: 100%; max-width: 340px;
  height: 56px; border-radius: 14px; border: none;
  background: var(--accent); color: white;
  font-size: 17px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: opacity 0.15s;
}
.btn-generate:active { opacity: 0.88; }
/* ─── Slide animations ────── */
@keyframes slideR { from { transform:translateX(36px); opacity:0; } to { transform:translateX(0); opacity:1; } }
@keyframes slideL { from { transform:translateX(-36px); opacity:0; } to { transform:translateX(0); opacity:1; } }
.anim-fwd { animation: slideR 0.24s cubic-bezier(.4,0,.2,1) forwards; }
.anim-bk  { animation: slideL 0.24s cubic-bezier(.4,0,.2,1) forwards; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const FIRE_TYPES = [
  { id: "lean",    name: "Lean FIRE",    desc: "极简生活，低支出，越早退越好。自由比物质更重要。" },
  { id: "regular", name: "Regular FIRE", desc: "维持现在的生活水平退休，不奢求，也不将就。" },
  { id: "fat",     name: "Fat FIRE",     desc: "退休后品质还要提升，旅行、美食、爱好都不妥协。" },
  { id: "barista", name: "Barista FIRE", desc: "半退休，做些轻松的兼职或爱好，不完全靠投资维生。" },
  { id: "coast",   name: "Coast FIRE",   desc: "早期存够本金，之后靠复利慢慢涨，换份压力小的工作。" },
];

const EXP_ITEMS = [
  { key: "rent",          label: "房租或房贷月供" },
  { key: "food",          label: "餐饮与日常生活" },
  { key: "children",      label: "子女教育（含课外培训）", childOnly: true },
  { key: "parents",       label: "赡养父母" },
  { key: "transport",     label: "交通出行" },
  { key: "insurance",     label: "商业保险保费" },
  { key: "entertainment", label: "娱乐、旅行、爱好" },
  { key: "other",         label: "其他固定支出" },
];

const ALLOC_ITEMS = [
  { key: "deposit", label: "存款/余额宝/货币基金" },
  { key: "wealth",  label: "银行理财/信托产品" },
  { key: "fund",    label: "公募基金（指数/主动）" },
  { key: "stock",   label: "直接持股（A股/港美股）" },
  { key: "other",   label: "其他（如黄金、外汇、私募、数字资产等）" },
];

// condition shorthand: cond receives answers object
const Qs = [
  // ── 基本信息 ────────────────────────────────────────────────────────────
  { id:"age",        mod:"基本信息", q:"你今年多大？",
    type:"number", min:18, max:65, unit:"岁", def:28, cond:()=>true },
  { id:"fire_age",   mod:"基本信息", q:"你希望最晚几岁，不再为钱工作？",
    type:"number", min:30, max:75, unit:"岁", def:50,
    hint:"不用太精确，给个大概的感觉就好", cond:()=>true },
  { id:"calc_scope", mod:"基本信息", q:"这份FIRE测算按什么口径来算？",
    type:"single", opts:["只算我个人","按整个家庭一起算"],
    hint:"如果家庭收入、支出和资产已经混在一起，建议选家庭口径", cond:()=>true },
  { id:"marital",    mod:"基本信息", q:"你目前的感情状态？",
    type:"single", opts:["单身","已婚或同居，对方有收入","已婚或同居，对方无收入"], cond:()=>true },
  { id:"spouse_inc", mod:"基本信息", q:"对方的税后月收入大约是多少？",
    type:"slider", min:2000, max:60000, step:500, unit:"元", def:8000,
    cond:a=>a.marital==="已婚或同居，对方有收入" },
  { id:"children",   mod:"基本信息", q:"你有几个孩子？",
    type:"single", opts:["没有","1个","2个","3个及以上"], cond:()=>true },
  { id:"child_edu",  mod:"基本信息", q:"孩子的教育规划里，包含出国留学吗？",
    type:"single", opts:["考虑本科出国","考虑研究生出国","暂时不考虑","还没想好"],
    cond:a=>a.children && a.children!=="没有" },
  { id:"city",       mod:"基本信息", q:"你现在住在哪类城市？",
    type:"single", opts:["北上广深","新一线城市","二线城市","三线及以下"], cond:()=>true },
  { id:"retire_city",mod:"基本信息", q:"退休后你打算住在哪？",
    type:"single", opts:["继续待在现居城市","回二三线城市或老家","出国生活","还没想好"], cond:()=>true },

  // ── 收入情况 ────────────────────────────────────────────────────────────
  { id:"employment", mod:"收入情况", q:"你目前的工作性质？",
    type:"single", opts:["机关/事业单位（体制内）","国有企业","外资/合资/民营企业","个体工商户或自由职业","创业者/企业主"], cond:()=>true },
  { id:"annuity",    mod:"收入情况", q:"你有职业年金或企业年金吗？",
    type:"single", opts:["有，体制内职业年金","有，公司企业年金","没有"],
    cond:a=>a.employment==="机关/事业单位（体制内）"||a.employment==="国有企业" },
  { id:"income",     mod:"收入情况", q:"你的税后月收入大约是多少？",
    type:"slider", min:0, max:100000, step:500, unit:"元", def:10000,
    hint:"请把年终奖平摊到每个月一起算", cond:()=>true },
  { id:"side_inc",   mod:"收入情况", q:"除主业外，你有其他收入来源吗？",
    type:"single", opts:["没有","有，月均500元以下","有，月均500-3000元","有，月均3000元以上"],
    hint:"例如投资分红、租金、兼职、副业、咨询、内容创作或其他非工资收入", cond:()=>true },
  { id:"stability",  mod:"收入情况", q:"你如何评价自己的收入稳定性？",
    type:"single", opts:["非常稳定，几乎没波动","较稳定，但奖金有波动","不太稳定，依赖绩效或项目","有明显的职业年龄风险（互联网/金融等）"], cond:()=>true },
  { id:"monthly_invest", mod:"收入情况", q:"你每月实际能投入FIRE账户的钱大约是多少？",
    type:"slider", min:0, max:100000, step:500, unit:"元", def:3000,
    hint:"按真实可持续金额填写，不用等于收入减支出的理论值", cond:()=>true },

  // ── 支出情况 ────────────────────────────────────────────────────────────
  { id:"expenses",     mod:"支出情况", q:"你每个月大概花多少钱？",
    type:"expense_table", cond:()=>true },
  { id:"retire_exp",   mod:"支出情况", q:"退休后，你每月需要多少钱生活？",
    type:"slider", min:1000, max:30000, step:500, unit:"元", def:6000,
    hint:"用今天的物价估算，系统会自动考虑通胀", cond:()=>true },
  { id:"retire_house", mod:"支出情况", q:"退休后你的住房成本大概是？",
    type:"single", opts:["有自有住房，无租金或房贷","可能还需租房，月租1000-2000元","可能还需租房，月租2000元以上","现在完全不确定"], cond:()=>true },
  { id:"big_exp",      mod:"支出情况", q:"未来5年内，有这些大额支出计划吗？",
    type:"multi", exclusiveOpt:"没有明确的大额计划",
    opts:["子女教育大额支出","父母大额医疗","创业或投资新项目","装修、婚礼或搬家","其他一次性大额支出","没有明确的大额计划"], cond:()=>true },

  // ── 社保公积金 ──────────────────────────────────────────────────────────
  { id:"ss_years",  mod:"社保公积金", q:"你已经缴了几年养老保险？",
    type:"single", opts:["3年以下","3-10年","10-15年","15年以上"],
    hint:"💡 领取养老金的最低门槛是累计缴满15年", cond:()=>true },
  { id:"ss_15yr",   mod:"社保公积金", q:"考虑到你计划提前退休，能缴满15年吗？",
    type:"single", opts:["没问题，年限够用","需要规划，有点卡","可能有缺口，不确定","不打算依赖养老金，会自己安排"],
    cond:a=>a.ss_years && a.ss_years!=="15年以上" },
  { id:"gjj_bal",   mod:"社保公积金", q:"你的住房公积金账户余额大约是多少？",
    type:"slider", min:0, max:500000, step:5000, unit:"元", def:30000, cond:()=>true },
  { id:"gjj_plan",  mod:"社保公积金", q:"公积金你打算怎么用？",
    type:"single", opts:["购房或偿还房贷","退休后提取备用","还没规划"], cond:()=>true },
  { id:"pension_cover", mod:"社保公积金", q:"你预计养老金能覆盖退休后多少生活费？",
    type:"single", opts:["基本不把养老金算进计划","20%以下","20-40%","40%以上","不确定"],
    hint:"不用精算，先判断它在你FIRE计划里的重要性", cond:()=>true },

  // ── 资产负债 ────────────────────────────────────────────────────────────
  { id:"prop_cnt",  mod:"资产负债", q:"你名下有几套房？",
    type:"single", opts:["没有","1套，无房贷","1套，有房贷","2套及以上，无房贷","2套及以上，有房贷"], cond:()=>true },
  { id:"prop_val",  mod:"资产负债", q:"房产现在大约值多少钱？",
    type:"slider", min:200000, max:10000000, step:100000, unit:"元", def:2000000,
    cond:a=>a.prop_cnt && a.prop_cnt!=="没有" },
  { id:"prop_debt", mod:"资产负债", q:"还有多少房贷没还？",
    type:"slider", min:0, max:5000000, step:50000, unit:"元", def:1000000,
    cond:a=>a.prop_cnt && a.prop_cnt.includes("有房贷") },
  { id:"prop_plan", mod:"资产负债", q:"有没有考虑过退休后卖房或以房养老？",
    type:"single", opts:["有这个打算","有想法但还没确定","没考虑过"],
    cond:a=>a.prop_cnt && a.prop_cnt!=="没有" },
  { id:"home_plan",  mod:"资产负债", q:"如果未来要买房，你的计划大概是？",
    type:"single", opts:["计划5年内买","计划5年以后买","打算一直租房","还没想好"],
    cond:a=>a.prop_cnt==="没有" },
  { id:"home_city",  mod:"资产负债", q:"打算在哪个城市买房？",
    type:"single", opts:["就在现居城市","回老家或二三线城市","还没定"],
    cond:a=>a.home_plan && a.home_plan.startsWith("计划") },
  { id:"fin_assets",mod:"资产负债", q:"你目前的金融资产总共大约多少钱？",
    type:"slider", min:0, max:3000000, step:10000, unit:"元", def:50000,
    hint:"存款、基金、股票、理财等全部加在一起", cond:()=>true },
  { id:"alloc",     mod:"资产负债", q:"这些钱主要放在哪里？",
    type:"allocation", cond:()=>true },
  { id:"emergency_months", mod:"资产负债", q:"你的现金类资产能覆盖几个月生活费？",
    type:"single", opts:["3个月以下","3-6个月","6-12个月","12个月以上","不确定"],
    hint:"现金类资产包括存款、货币基金等能随时取用的钱", cond:()=>true },
  { id:"has_equity", mod:"资产负债", q:"你有尚未变现的权益类资产吗？",
    type:"single", opts:["没有","有，金额不大","有，预计变现金额较大"],
    hint:"例如公司股权、期权、合伙份额、项目分红权，或其他未来可能变现的权益", cond:()=>true },
  { id:"eq_years",   mod:"资产负债", q:"这类权益大概多少年后可以变现？",
    type:"number", min:1, max:10, unit:"年内", def:3,
    cond:a=>a.has_equity && a.has_equity!=="没有" },
  { id:"eq_amount",  mod:"资产负债", q:"预计可变现金额大约是多少？",
    type:"slider", min:50000, max:3000000, step:50000, unit:"元", def:300000,
    cond:a=>a.has_equity && a.has_equity!=="没有" },
  { id:"debts",     mod:"资产负债", q:"除房贷外，还有其他负债吗？",
    type:"multi", exclusiveOpt:"没有其他负债",
    opts:["消费贷/信用贷","车贷","信用卡未还清","向亲友借了钱","没有其他负债"], cond:()=>true },
  { id:"debt_amount", mod:"资产负债", q:"这些非房贷负债还剩多少钱？",
    type:"slider", min:0, max:1000000, step:5000, unit:"元", def:50000,
    cond:a=>Array.isArray(a.debts) && a.debts.some(x=>x!=="没有其他负债") },
  { id:"debt_pressure", mod:"资产负债", q:"这些负债对现金流压力大吗？",
    type:"single", opts:["压力很小，可以轻松覆盖","有压力，但可控","压力较大，影响储蓄","已经明显影响正常生活"],
    cond:a=>Array.isArray(a.debts) && a.debts.some(x=>x!=="没有其他负债") },

  // ── 家庭责任 ────────────────────────────────────────────────────────────
  { id:"par_pension",mod:"家庭责任", q:"你父母有退休养老金吗？",
    type:"single", opts:["双方都有，而且够用","有但金额少，需要我补贴","只有一方有","都没有，主要靠我养"], cond:()=>true },
  { id:"par_money",  mod:"家庭责任", q:"你每个月大约给父母多少钱？",
    type:"slider", min:0, max:10000, step:200, unit:"元", def:1000,
    cond:a=>a.par_pension && a.par_pension!=="双方都有，而且够用" },
  { id:"par_med",    mod:"家庭责任", q:"父母的医疗保障情况怎么样？",
    type:"single", opts:["完善：医保+商业险都有","一般：有基本医保，无商业险","较弱：只有农村合作医疗","很薄弱：基本没有任何保障"], cond:()=>true },
  { id:"par_ins",    mod:"家庭责任", q:"有没有考虑过给父母买商业医疗险？",
    type:"single", opts:["已经买了","有想法，还没买","觉得太贵或太麻烦","从来没想过这件事"],
    cond:a=>a.par_med && !a.par_med.startsWith("完善") },

  // ── 投资理财 ────────────────────────────────────────────────────────────
  { id:"inv_methods",mod:"投资理财", q:"未来用于FIRE的钱，你计划主要怎么投资？",
    type:"multi", exclusiveOpt:"还没有明确投资计划",
    opts:["现金和货币基金为主","银行理财或债券类产品","指数基金/ETF（被动投资）","主动基金或基金投顾","自己持股（A股/港美股）","房产或REITs","还没有明确投资计划"], cond:()=>true },
  { id:"exp_return", mod:"投资理财", q:"你预期长期年化收益率（扣通胀后）大约多少？",
    type:"return_select", opts:["2%以下（主要靠存款）","2-4%","4-6%（指数基金预期区间）","6%以上"], cond:()=>true },
  { id:"risk",       mod:"投资理财", q:"某一年你的投资亏了，最多能接受亏多少？",
    type:"single", opts:["5%以下，一亏就很焦虑","5-15%，可以接受","15-30%，能扛住","30%以上，完全不怕"], cond:()=>true },
  { id:"know_4pct",  mod:"投资理财", q:"你了解“4%提取法则”吗？",
    type:"single", opts:["了解，认为适合我","了解，但不确定在中国是否适用","听说过，不太懂","完全不知道"], cond:()=>true },

  // ── 保险保障 ────────────────────────────────────────────────────────────
  { id:"med_ins",    mod:"保险保障", q:"你的医保是哪种？",
    type:"single", opts:["城镇职工医保（公司参保）","城乡居民医保（自己缴）","没有医保"], cond:()=>true },
  { id:"com_ins",    mod:"保险保障", q:"你买了哪些商业保险？",
    type:"multi", exclusiveOpt:"没有买过任何商业保险",
    opts:["重疾险","百万医疗险/住院险","定期寿险","意外险","年金险/增额终身寿","没有买过任何商业保险"], cond:()=>true },
  { id:"coverage_level", mod:"保险保障", q:"你觉得现有保额够覆盖家庭风险吗？",
    type:"single", opts:["基本够用","只够覆盖一部分","明显不够","不确定"],
    hint:"可以粗略按3-5年家庭支出、房贷和赡养责任来判断",
    cond:a=>Array.isArray(a.com_ins) && a.com_ins.some(x=>x!=="没有买过任何商业保险") },

  // ── 宏观认知 ────────────────────────────────────────────────────────────
  { id:"inflation",  mod:"宏观认知", q:"你觉得未来每年物价大概涨多少？",
    type:"single", opts:["2%以下，物价比较稳定","2-3%左右","3-5%，感觉涨得挺快","5%以上，通胀压力很大"], cond:()=>true },
  { id:"delay_ret",  mod:"宏观认知", q:"延迟退休政策对你的FIRE计划有影响吗？",
    type:"single", opts:["影响很大，会推迟我领养老金的时间","有影响，但我计划提前离职，不依赖法定退休时间","影响不大，我的计划不靠养老金"], cond:()=>true },

  // ── FIRE 目标 ───────────────────────────────────────────────────────────
  { id:"fire_type",  mod:"FIRE目标", q:"你理想中的退休是哪种状态？",
    type:"fire_type", cond:()=>true },
  { id:"obstacles",  mod:"FIRE目标", q:"实现FIRE最大的障碍是什么？最多选3个",
    type:"multi", maxSelect:3,
    opts:["收入水平不够高","房贷/生活压力大，存不下钱","父母赡养支出难以预控","不知道怎么有效投资","担心政策变化影响","职业可持续性存疑（如35岁危机）","缺乏坚持执行的动力","健康或意外风险"],
    cond:()=>true },
  { id:"prep",       mod:"FIRE目标", q:"目前为FIRE做了多少准备？",
    type:"single", opts:["有详细计划，一直在执行","有大致方向，但还没系统规划","刚开始了解，处于探索阶段","填这份问卷之前基本没认真想过"], cond:()=>true },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmt = v => {
  if (v === 0 || v === undefined) return "0";
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}亿`;
  if (v >= 10000) return `${parseFloat((v / 10000).toFixed(1))}万`;
  return v.toLocaleString("zh-CN");
};

const isAnswered = (q, answers) => {
  const v = answers[q.id];
  if (q.type === "number" || q.type === "slider") return true; // always has default
  if (q.type === "single" || q.type === "fire_type") return !!v;
  if (q.type === "return_select") return !!v && (v.choice !== "其他" || !!v.custom);
  if (q.type === "multi") return Array.isArray(v) && v.length > 0;
  return true; // expense_table, allocation always passable
};

const getVisible = answers => Qs.filter(q => q.cond(answers));

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function NumberInput({ q, value, onChange }) {
  const v = value ?? q.def ?? q.min;
  return (
    <div className="num-wrap">
      <div className="num-row">
        <button className="num-btn" onClick={() => onChange(Math.max(q.min, v - 1))}>−</button>
        <div>
          <div className="num-val">{v}</div>
          <div style={{ textAlign: "center" }}><span className="num-unit">{q.unit}</span></div>
        </div>
        <button className="num-btn" onClick={() => onChange(Math.min(q.max, v + 1))}>+</button>
      </div>
    </div>
  );
}

function SingleSelect({ q, value, onChange, onAutoNext }) {
  const pick = opt => {
    onChange(opt);
    if (onAutoNext) setTimeout(() => onAutoNext(opt), 260);
  };
  return (
    <div className="opts">
      {q.opts.map(opt => (
        <button key={opt} className={`opt${value === opt ? " sel" : ""}`} onClick={() => pick(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ q, value = [], onChange }) {
  const toggle = opt => {
    if (value.includes(opt)) {
      onChange(value.filter(x => x !== opt));
    } else {
      if (q.maxSelect && value.length >= q.maxSelect) return;
      if (q.exclusiveOpt) {
        onChange(opt === q.exclusiveOpt
          ? [opt]
          : [...value.filter(x => x !== q.exclusiveOpt), opt]);
      } else {
        onChange([...value, opt]);
      }
    }
  };
  return (
    <div>
      <div className="opts">
        {q.opts.map(opt => (
          <button key={opt} className={`opt${value.includes(opt) ? " sel" : ""}`} onClick={() => toggle(opt)}>
            <div className="m-opt">
              <div className="chk">{value.includes(opt) ? "✓" : ""}</div>
              {opt}
            </div>
          </button>
        ))}
      </div>
      {q.maxSelect && (
        <div className="max-hint">最多选 {q.maxSelect} 个（已选 {value.length} 个）</div>
      )}
    </div>
  );
}

function SliderInput({ q, value, onChange }) {
  const v = value ?? q.def ?? q.min;
  return (
    <div className="sld-wrap">
      <div className="sld-val">{fmt(v)}<span>{q.unit}</span></div>
      <input type="range" min={q.min} max={q.max} step={q.step || 1}
        value={v} onChange={e => onChange(Number(e.target.value))} />
      <div className="sld-ends"><span>{fmt(q.min)}</span><span>{fmt(q.max)}</span></div>
    </div>
  );
}

function ExpenseTable({ hasChildren, value = {}, monthlyIncome, onChange }) {
  const items = EXP_ITEMS.filter(it => !it.childOnly || hasChildren);
  const total = items.reduce((s, it) => s + (Number(value[it.key]) || 0), 0);
  const savings = (monthlyIncome || 0) - total;
  const rate = monthlyIncome > 0 ? Math.round(Math.max(0, savings) / monthlyIncome * 100) : null;

  return (
    <div className="exp-list">
      {items.map(it => (
        <div key={it.key} className="exp-row">
          <span className="exp-lbl">{it.label}</span>
          <input className="exp-inp" type="number" inputMode="numeric"
            placeholder="0" value={value[it.key] || ""}
            onChange={e => onChange({ ...value, [it.key]: Number(e.target.value) || 0 })} />
          <span className="exp-unit">元</span>
        </div>
      ))}
      <div className="exp-total">
        <span className="exp-total-lbl">月均总支出</span>
        <span className="exp-total-val">{fmt(total)} 元</span>
      </div>
      {rate !== null && (
        <div className="savings-note">
          💰 月均可储蓄约 <strong>{fmt(Math.max(0, savings))} 元</strong>，储蓄率约 <strong>{rate}%</strong>
          {rate >= 40 ? "　—　这个储蓄率很不错" : rate >= 25 ? "　—　还有提升空间" : "　—　储蓄率偏低，需要关注"}
        </div>
      )}
    </div>
  );
}

function AllocationInput({ value = {}, onChange }) {
  const total = ALLOC_ITEMS.reduce((s, it) => s + (Number(value[it.key]) || 0), 0);
  const ok = Math.abs(total - 100) <= 3;
  return (
    <div>
      <div className="alloc-list">
        {ALLOC_ITEMS.map(it => (
          <div key={it.key} className="alloc-row">
            <span className="alloc-lbl">{it.label}</span>
            <input className="alloc-inp" type="number" inputMode="numeric"
              min={0} max={100} placeholder="0"
              value={value[it.key] || ""}
              onChange={e => onChange({ ...value, [it.key]: Number(e.target.value) || 0 })} />
            <span style={{ fontSize: 13, color: "var(--text-3)" }}>%</span>
          </div>
        ))}
      </div>
      <div className={`alloc-sum ${ok ? "ok" : "warn"}`}>
        {ok ? `✓ 合计 ${total}%，看起来没问题` : `合计 ${total}%，最好加起来等于 100%`}
      </div>
    </div>
  );
}

function FireTypeSelect({ value, onChange, onAutoNext }) {
  const pick = id => {
    onChange(id);
    if (onAutoNext) setTimeout(() => onAutoNext(id), 260);
  };
  return (
    <div className="fire-list">
      {FIRE_TYPES.map(t => (
        <button key={t.id} className={`fire-card${value === t.id ? " sel" : ""}`} onClick={() => pick(t.id)}>
          <div className="fire-name">{t.name}</div>
          <div className="fire-desc">{t.desc}</div>
        </button>
      ))}
    </div>
  );
}

function ReturnSelect({ q, value, onChange }) {
  const selected = value?.choice;
  const pick = choice => onChange({ choice, custom: choice === "其他" ? (value?.custom || "") : "" });

  return (
    <div>
      <div className="opts">
        {[...q.opts, "其他"].map(opt => (
          <button key={opt} className={`opt${selected === opt ? " sel" : ""}`} onClick={() => pick(opt)}>
            {opt === "其他" ? "其他，自行填写年化收益率" : opt}
          </button>
        ))}
      </div>
      {selected === "其他" && (
        <div className="custom-return">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="30"
            step="0.1"
            placeholder="例如 3.5"
            value={value?.custom || ""}
            onChange={e => onChange({ choice: "其他", custom: e.target.value })}
          />
          <span>% / 年</span>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function FireQuestionnaire() {
  const navigate = useNavigate();
  const [answers,    setAnswers]    = useState({});
  const [currentId,  setCurrentId]  = useState(Qs[0].id);
  const [history,    setHistory]    = useState([]);
  const [direction,  setDirection]  = useState("forward");
  const [animKey,    setAnimKey]    = useState(0);
  const [done,       setDone]       = useState(false);

  const visible  = getVisible(answers);
  const currentQ = Qs.find(q => q.id === currentId);
  const cidx     = visible.findIndex(q => q.id === currentId);
  const progress = visible.length > 0 ? (cidx + 1) / visible.length : 0;
  const canNext  = currentQ && isAnswered(currentQ, answers);

  const setAns = useCallback(val => {
    setAnswers(prev => ({ ...prev, [currentId]: val }));
  }, [currentId]);

  const goNext = useCallback((latestVal) => {
    const a = latestVal !== undefined
      ? { ...answers, [currentId]: latestVal }
      : answers;
    if (!isAnswered(currentQ, a)) return;
    const vis = getVisible(a);
    const ni = vis.findIndex(q => q.id === currentId) + 1;
    if (ni >= vis.length) { setDone(true); return; }
    setHistory(h => [...h, currentId]);
    setDirection("forward");
    setAnimKey(k => k + 1);
    setCurrentId(vis[ni].id);
  }, [answers, currentId, currentQ]);

  const goBack = useCallback(() => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setDirection("back");
    setAnimKey(k => k + 1);
    setCurrentId(prev);
  }, [history]);

  if (done) {
    const totalAnswered = Object.keys(answers).length;
    return (
      <>
        <style>{CSS}</style>
        <div className="app">
          <div className="done-wrap">
            <div className="done-icon">🔥</div>
            <div className="done-title">问卷完成了</div>
            <div className="done-sub">
              你回答了 {totalAnswered} 个问题，我们已经收集到足够的信息，正在准备为你生成专属报告。
            </div>
            <div className="done-card">
              <div className="done-card-title">你的免费报告将包含</div>
              {["FIRE目标金额测算", "预计达到FIRE的年龄", "你的2个最关键风险点", "与同类人群的横向对比"].map(t => (
                <div key={t} className="done-item"><div className="done-dot"/>{t}</div>
              ))}
            </div>
            <button className="btn-generate" onClick={() => navigate("/")}>
              生成我的报告 →
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!currentQ) return null;
  const v = answers[currentId] ?? (
    (currentQ.type === "number" || currentQ.type === "slider") ? currentQ.def : undefined
  );
  const hasChildren = answers.children && answers.children !== "没有";

  const renderInput = () => {
    switch (currentQ.type) {
      case "number":
        return <NumberInput q={currentQ} value={v} onChange={setAns} />;
      case "single":
        return <SingleSelect q={currentQ} value={v} onChange={setAns} onAutoNext={goNext} />;
      case "multi":
        return <MultiSelect q={currentQ} value={v} onChange={setAns} />;
      case "slider":
        return <SliderInput q={currentQ} value={v} onChange={setAns} />;
      case "expense_table":
        return <ExpenseTable hasChildren={hasChildren} value={v || {}} onChange={setAns}
          monthlyIncome={answers.income ?? 10000} />;
      case "allocation":
        return <AllocationInput value={v || {}} onChange={setAns} />;
      case "fire_type":
        return <FireTypeSelect value={v} onChange={setAns} onAutoNext={goNext} />;
      case "return_select":
        return <ReturnSelect q={currentQ} value={v} onChange={setAns} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* ── Header ── */}
        <div className="hdr">
          <div className="hdr-top">
            <span className="mod-chip">{currentQ.mod}</span>
            <span className="hdr-count">{cidx + 1} / {visible.length}</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        {/* ── Question ── */}
        <div key={animKey} className={`q-wrap anim-${direction === "forward" ? "fwd" : "bk"}`}>
          <div className="q-text">{currentQ.q}</div>
          {currentQ.hint && <div className="q-hint">{currentQ.hint}</div>}
          {renderInput()}
        </div>

        {/* ── Nav ── */}
        <div className="nav">
          <button className="btn-back" onClick={goBack} disabled={!history.length}>←</button>
          <button className="btn-next" onClick={() => goNext()} disabled={!canNext}>
            {cidx === visible.length - 1 ? "完成 ✓" : "下一题 →"}
          </button>
        </div>
      </div>
    </>
  );
}
