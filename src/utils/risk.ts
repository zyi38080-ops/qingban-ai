/**
 * 风险识别工具
 * 基于关键词规则识别高风险表达
 */

// 高风险关键词
const HIGH_RISK_KEYWORDS = [
  '自杀', '自残', '想死', '不想活了', '结束生命',
  '想伤害自己', '想伤害别人', '杀', '被打', '被威胁',
  '很危险', '控制不住自己', '活不下去', '死了算了',
  '割腕', '跳楼', '跳河', '上吊', '安眠药',
  '虐待', '家暴', '被跟踪', '求救',
];

export interface RiskResult {
  isHighRisk: boolean;
  keywords: string[];
}

/**
 * 识别用户输入中的高风险表达
 * @param text 用户输入（已脱敏）
 * @returns 风险评估结果
 */
export function classifyRisk(text: string): RiskResult {
  const matched: string[] = [];
  const lower = text.toLowerCase();

  for (const kw of HIGH_RISK_KEYWORDS) {
    if (lower.includes(kw)) {
      matched.push(kw);
    }
  }

  return {
    isHighRisk: matched.length > 0,
    keywords: matched,
  };
}