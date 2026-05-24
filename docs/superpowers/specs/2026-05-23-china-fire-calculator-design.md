# 中文 FIRE 计算与规划网站产品设计

日期：2026-05-23

## 目标

基于多计算器 FIRE 工具的功能思路，建设一个面向中文用户的 FIRE 计算与规划网站。第一版重点解决三个问题：

1. 用户能快速算出自己的 FIRE 目标金额、缺口和预计达成年龄。
2. 用户能比较 Standard FIRE、Coast FIRE、Barista FIRE、Reverse FIRE 等不同路径。
3. 中国用户常见的社保、公积金、房产、父母赡养、子女教育、医保和商业保险变量能被纳入判断，但不在第一版做过度精算。

现有 FIRE 问卷继续保留，但定位调整为“智能引导 / 个性化报告入口”，不再作为唯一主产品。

## 产品原则

- 先做可信、可调、可理解的计算器，再做复杂规划系统。
- 所有核心计算默认在浏览器本地完成，降低隐私顾虑。
- 不照抄参考项目视觉和文案，只借鉴多计算器、前端本地计算、URL 状态分享、PWA/离线友好的结构思路。
- 中国本土变量先以轻量输入、风险提示、现金流调整的形式进入模型；政策性强、精算复杂的部分留到第二版。
- 每个计算器只展示完成任务所需的字段，高级变量统一收纳在“中国本土调整”或“高级假设”区域。

## 第一版范围

第一版是“中文 FIRE 计算器中台 + 智能引导入口”。

### 必做页面

- 首页 `/`
  - 展示核心计算器入口。
  - 明确提供“我知道要算什么”和“帮我选择 FIRE 路径”两种入口。
  - 不做长篇营销页。
- 计算器总览 `/calculators`
  - 列出所有第一版计算器。
  - 每个计算器说明适合谁、能回答什么问题。
- Standard FIRE `/calculators/standard`
- Coast FIRE `/calculators/coast`
- Barista FIRE `/calculators/barista`
- Reverse FIRE `/calculators/reverse`
- Savings Rate `/calculators/savings-rate`
- Withdrawal Rate `/calculators/withdrawal-rate`
- 智能引导 `/guide`
  - 承接当前问卷原型。
  - 生成统一输入数据和推荐路径。
- 报告页 `/report`
  - 展示智能引导结果。
  - 推荐最相关的 1-2 个计算器，并带入问卷数据。
- 参数说明 `/assumptions`
  - 解释实际收益率、通胀、提取率、养老金覆盖比例、免责声明。

### 第一版计算器

#### Standard FIRE

回答“按当前投入速度，我什么时候能 FIRE？”

核心输入：

- 当前年龄
- 当前金融资产
- 退休后年支出或月支出
- 每月可投资金额
- 预期实际年化收益率
- 提取率

核心输出：

- FIRE 目标金额
- 当前缺口
- 预计达成年龄和剩余年数
- 进度比例
- 对收益率、提取率、月投入的敏感提示

#### Coast FIRE

回答“我现在存下的钱靠复利，到目标退休年龄是否足够？”

核心输入：

- 当前年龄
- 目标退休年龄
- 当前金融资产
- 退休后年支出
- 预期实际年化收益率
- 提取率

核心输出：

- Coast FIRE 所需当前本金
- 当前是否已达标
- 若未达标，还差多少
- 达标后可降低月投入的提示

#### Barista FIRE

回答“如果退休后还有兼职、副业、租金或养老金，我需要多少投资资产？”

核心输入：

- 退休后月支出
- 退休后月收入：兼职、副业、租金、养老金或其他现金流
- 当前金融资产
- 每月可投资金额
- 预期实际年化收益率
- 提取率

核心输出：

- 需要由投资组合覆盖的月支出缺口
- Barista FIRE 目标资产
- 预计达成年龄
- 对收入稳定性的风险提示

#### Reverse FIRE

回答“如果我想在某个年龄 FIRE，每月需要投入多少？”

核心输入：

- 当前年龄
- 目标 FIRE 年龄
- 当前金融资产
- 退休后年支出
- 预期实际年化收益率
- 提取率

核心输出：

- 目标资产
- 每月所需投资金额
- 与当前可投资金额的差距
- 目标是否现实的提示

#### Savings Rate

回答“我的储蓄率是多少，它意味着什么？”

核心输入：

- 月收入
- 配偶或家庭其他收入
- 月支出
- 每月投资金额

核心输出：

- 储蓄率
- 可投资现金流
- 支出结构提示
- 与 FIRE 达成速度的粗略关系

#### Withdrawal Rate

回答“按某个提取率，我现有资产能覆盖多少支出？”

核心输入：

- 当前投资资产
- 年支出
- 目标提取率
- 展开字段：退休后其他收入

核心输出：

- 当前可支持的年支出
- 当前隐含提取率
- 与 3%、3.5%、4% 档位对比
- 风险提示

### 第一版中国本土变量

第一版纳入但不深度精算：

- 社保累计缴费年限
- 养老金覆盖比例估计
- 公积金余额和用途
- 自住房、房贷余额、退休后住房成本
- 父母养老金和每月赡养金额
- 父母医疗保障水平
- 子女数量和教育支出
- 医保类型和商业保险配置
- 现居城市和退休城市

这些变量用于：

- 调整现金流和退休后支出。
- 生成风险标签。
- 推荐更合适的计算器。
- 在报告中给出下一步行动建议。

不在第一版做：

- 精确养老金测算。
- 医保待遇精算。
- 公积金贷款和提取规则细化。
- 房产税费、卖房、出租和换城模型。
- 家庭双人生命周期模型。

## 第二版范围

第二版建立在第一版真实使用反馈之上。

优先级队列：

- 养老金估算器：职工养老、居民养老、缴费年限、缴费基数、法定退休年龄。
- 医疗与保障缺口：医保断缴、商业医疗险、重疾险、家庭责任保额。
- 房产情景模拟：卖房、出租、换城市、提前还贷 vs 投资。
- 家庭双人 FIRE：夫妻不同收入、社保、公积金、退休年龄和风险责任。
- 压力测试：收益率下修、通胀上升、职业中断、父母医疗大额支出、市场下跌。
- 多方案保存和对比。
- PDF / 图片报告导出。
- 登录和云端保存。
- 内容体系和 SEO。

## 核心用户路径

### 路径 A：目标明确用户

首页 -> 选择计算器 -> 输入关键参数 -> 查看结果 -> 调整假设 -> 保存或分享。

适合已经知道自己要算 Standard、Coast、Barista 或 Reverse 的用户。

### 路径 B：不确定路径用户

首页 -> 智能引导 -> 完成问卷 -> 查看报告 -> 进入推荐计算器并复用数据。

适合刚接触 FIRE 或不知道哪种 FIRE 更适合自己的用户。

### 路径 C：中国家庭责任用户

首页 -> Standard / Barista -> 打开中国本土调整 -> 填写房贷、父母、子女、医保等变量 -> 查看风险提示。

适合需要把家庭责任纳入 FIRE 可行性判断的用户。

## 信息架构

导航建议：

- 首页
- 计算器
- 智能引导
- 参数说明

计算器内部结构：

- 顶部：计算器标题、适用人群、核心问题。
- 左侧或上方：输入区。
- 右侧或下方：结果区。
- 结果区固定展示核心数字，避免用户滚动后失去反馈。
- 高级假设折叠展示。
- 中国本土调整折叠展示。

## 数据模型

### UserProfile

- age
- targetFireAge
- calculationScope: personal | household
- maritalStatus
- childrenCount
- currentCityTier
- retirementCityPlan
- employmentType

### CashFlow

- monthlyIncome
- spouseMonthlyIncome
- sideMonthlyIncome
- monthlyExpenses
- monthlyInvestment
- parentSupportMonthly
- childEducationMonthly
- housingMonthlyCost
- expectedRetirementMonthlyExpense
- expectedRetirementMonthlyIncome

### AssetsLiabilities

- financialAssets
- cashLikeAssets
- housingFundBalance
- propertyValue
- mortgageBalance
- otherDebtBalance
- equityAssetExpectedAmount
- equityAssetExpectedYears

### ChinaFactors

- socialSecurityYears
- canReachFifteenYears
- pensionCoverageEstimate
- housingFundPlan
- parentPensionStatus
- parentMedicalCoverage
- medicalInsuranceType
- commercialInsuranceTypes
- coverageLevel

### Assumptions

- realAnnualReturn
- inflationRate
- withdrawalRate
- retirementExpenseGrowthMode
- safetyBufferRate

### CalculatorResult

- fireNumber
- currentProgress
- assetGap
- yearsToFire
- targetAge
- requiredMonthlyInvestment
- coastRequiredPrincipal
- sustainableAnnualWithdrawal
- impliedWithdrawalRate
- riskFlags
- recommendedNextSteps

## Calculation Layer

第一版应建立纯函数计算层，计算逻辑独立于 UI：

- `calculateStandardFire(input)`
- `calculateCoastFire(input)`
- `calculateBaristaFire(input)`
- `calculateReverseFire(input)`
- `calculateSavingsRate(input)`
- `calculateWithdrawalRate(input)`
- `mapGuideAnswersToPlanInput(answers)`
- `generateRiskFlags(planInput, result)`

计算器共享同一套格式化、校验、年/月转换和复利工具函数。

第一版计算默认使用实际收益率，也就是扣除通胀后的收益率。页面必须解释这一点，避免同时输入名义收益率和通胀导致用户误解。

## 现有代码整合方案

当前项目是 React/Vite 原型，入口直接渲染 `FireQuestionnaire`。问卷文件把样式、问题配置、子组件、状态和完成页放在一个文件中。它是有价值的内容资产，但不适合作为完整网站的长期结构。

建议重构方向：

- 将 `fire-questionnaire.jsx` 拆成 `GuideFlow` 模块。
- 将问题数据 `Qs` 拆到配置文件。
- 将 `FIRE_TYPES`、支出项、资产配置项拆成 domain 配置。
- 将问卷 UI 组件拆为单选、多选、滑块、数字输入、支出表、资产配置表。
- 将问卷答案转换为统一 `FirePlanInput`。
- 报告页不直接读取问卷内部状态，而是读取统一输入和计算结果。
- 首页、计算器和报告成为主产品骨架，问卷作为 `/guide` 的入口模块。

建议目录结构：

```text
src/
  app/
    App.jsx
    routes.js
  pages/
    HomePage.jsx
    CalculatorsPage.jsx
    GuidePage.jsx
    ReportPage.jsx
    AssumptionsPage.jsx
  calculators/
    standard/
    coast/
    barista/
    reverse/
    savings-rate/
    withdrawal-rate/
  guide/
    GuideFlow.jsx
    guideQuestions.js
    answerMapping.js
  domain/
    fireCalculations.js
    fireTypes.js
    chinaFactors.js
    formatting.js
    validation.js
  components/
    inputs/
    layout/
    result/
```

## MVP 成功标准

- 用户能在 3 分钟内完成一个核心 FIRE 测算。
- 用户能在 10 分钟内理解 Standard、Coast、Barista、Reverse 中哪条路径更适合自己。
- 问卷能输出个性化报告，并把用户带到合适的计算器。
- 中国本土变量能影响提示和部分现金流结果，而不是只作为装饰性问题。
- 第一版不需要账户系统、不需要后端、不需要复杂政策精算。

## 风险和约束

- 金融结果不能表现为投资建议，应明确为规划测算。
- 政策变量会变化，第一版避免硬编码复杂政策规则。
- 提取率和收益率应提供保守默认值，并允许用户调整。
- 房产和养老金容易带来模型膨胀，应控制在第二版。
- 问卷较长，第一版应允许用户跳过智能引导，直接使用计算器。
- 工程交付应保持 Vercel 友好，支持后续部署到 Vercel，并接入用户提供的域名或在线预览地址。

## 下一步实施顺序

1. 建立应用路由和页面骨架。
2. 抽离现有问卷为 `/guide` 模块。
3. 建立 FIRE 计算纯函数和统一输入模型。
4. 实现 6 个核心计算器的最小可用版本。
5. 实现报告页和问卷答案映射。
6. 增加中国本土调整和风险标签。
7. 做移动端和桌面端体验检查。
8. 在用户提供域名或预览地址后，完成 Vercel 部署与在线预览验证。
