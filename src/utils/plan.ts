/**
 * 行动计划工具
 * 基于规则生成简短、具体、可执行的行动计划
 */

export interface PlanStep {
  order: number;
  description: string;
}

export interface ActionPlan {
  title: string;
  steps: PlanStep[];
}

// 预设计划模板
const PLAN_TEMPLATES: { keywords: string[]; plan: ActionPlan }[] = [
  {
    keywords: ['熬夜', '晚上', '两点', '凌晨', '睡觉', '失眠', '很晚', '半夜'],
    plan: {
      title: '早睡行动计划',
      steps: [
        { order: 1, description: '设定一个睡前30分钟的闹钟提醒' },
        { order: 2, description: '闹钟响后退出游戏，关闭屏幕' },
        { order: 3, description: '将手机放在床以外的地方充电' },
        { order: 4, description: '如果想继续玩，先喝杯水等待10分钟' },
        { order: 5, description: '明天记录自己是否成功提前入睡' },
      ],
    },
  },
  {
    keywords: ['充值', '花钱', '氪金', '消费', '支付', '买'],
    plan: {
      title: '充值冷静计划',
      steps: [
        { order: 1, description: '暂时关闭游戏内快捷支付功能' },
        { order: 2, description: '暂时删除已绑定的支付方式' },
        { order: 3, description: '给自己设定24小时冷静期' },
        { order: 4, description: '冲动时先写下"我为什么想充值"' },
        { order: 5, description: '24小时后再决定是否购买' },
      ],
    },
  },
  {
    keywords: ['父母', '吵架', '沟通', '冲突', '矛盾', '家长', '管', '骂'],
    plan: {
      title: '温和沟通计划',
      steps: [
        { order: 1, description: '等双方都平静下来再沟通' },
        { order: 2, description: '写下你想表达的3个要点' },
        { order: 3, description: '用"我感受到..."开头表达想法' },
        { order: 4, description: '试着了解对方的担心是什么' },
        { order: 5, description: '共同商定一个双方都能接受的方案' },
      ],
    },
  },
  {
    keywords: ['控制', '忍不住', '上瘾', '停不下来', '总是'],
    plan: {
      title: '自我控制提升计划',
      steps: [
        { order: 1, description: '记录今天游戏时长和触发场景' },
        { order: 2, description: '使用手机屏幕时间限制功能设定上限' },
        { order: 3, description: '每次想打游戏前先做10分钟其他事' },
        { order: 4, description: '准备一个"替代活动清单"贴在可见处' },
        { order: 5, description: '一周后回顾变化并调整目标' },
      ],
    },
  },
  {
    keywords: ['情绪', '生气', '烦躁', '焦虑', '难过', '压力'],
    plan: {
      title: '情绪调节计划',
      steps: [
        { order: 1, description: '暂停当前活动，做3次深呼吸' },
        { order: 2, description: '写下此刻的感受和想法' },
        { order: 3, description: '出去走5分钟或做简单的身体拉伸' },
        { order: 4, description: '听一首让自己放松的音乐' },
        { order: 5, description: '如果情绪仍然强烈，联系一个可信任的人聊聊' },
      ],
    },
  },
];

/**
 * 基于规则生成行动计划
 * @param userInput 用户输入
 * @returns 行动计划或 null
 */
export function createPlan(userInput: string): ActionPlan | null {
  const lower = userInput.toLowerCase();

  // 按模板匹配
  for (const template of PLAN_TEMPLATES) {
    for (const kw of template.keywords) {
      if (lower.includes(kw)) {
        return template.plan;
      }
    }
  }

  return null;
}

/**
 * 构建 LLM 生成计划的提示词
 */
export function buildPlanPrompt(userInput: string, context: string): string {
  return `请根据以下用户表达，生成一个简短、具体、可执行的行动计划。

用户表达：${userInput}

参考知识：${context}

要求：
1. 计划标题简洁明了；
2. 包含3-5个具体步骤；
3. 每个步骤可立即执行；
4. 不要包含说教性语言；
5. 格式为 JSON：

{
  "title": "计划标题",
  "steps": [
    { "order": 1, "description": "第一步描述" }
  ]
}`;
}
