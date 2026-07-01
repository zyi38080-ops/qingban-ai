/**
 * 隐私数据处理工具
 * 包含输入脱敏函数和敏感信息隐藏
 */

// 敏感信息模式
const PATTERNS: { name: string; regex: RegExp; replacement: string }[] = [
  // 手机号（中国大陆）
  { name: '手机号', regex: /1[3-9]\d{9}/g, replacement: '[已隐藏手机号]' },
  // 邮箱
  { name: '邮箱', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[已隐藏邮箱]' },
  // 身份证号（18位）
  { name: '身份证号', regex: /\d{6}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]/g, replacement: '[已隐藏身份证号]' },
  // 银行卡号（16-19位）
  { name: '银行卡号', regex: /\d{16,19}/g, replacement: '[已隐藏银行卡号]' },
  // 微信号或QQ号
  { name: '微信号/QQ号', regex: /(?:微信(?:号)?|w(?:e)?chat(?:\s*id)?)[：:\s]*[a-zA-Z0-9_-]{6,20}/gi, replacement: '[已隐藏微信号]' },
  { name: 'QQ号', regex: /(?:QQ|qq)(?:\s*号)?[：:\s]*\d{5,11}/g, replacement: '[已隐藏QQ号]' },
  // 地址关键词
  { name: '地址', regex: /(?:住址|地址|住在|家住|住在)\s*[：:\s]*[一-龥\d\w\s]{4,50}/g, replacement: '[已隐藏地址信息]' },
  // 密码关键词
  { name: '密码', regex: /(?:密码|password|passwd|pwd)\s*[：:=]\s*\S+/gi, replacement: '[已隐藏密码]' },
];

export interface SanitizeResult {
  sanitized: string;
  hidden: string[];
}

/**
 * 对用户输入进行脱敏处理
 * @param text 用户原始输入
 * @returns 脱敏后的文本和被隐藏的信息类型
 */
export function sanitizeInput(text: string): SanitizeResult {
  let sanitized = text;
  const hidden: string[] = [];

  for (const pattern of PATTERNS) {
    const matches = sanitized.match(pattern.regex);
    if (matches) {
      hidden.push(pattern.name);
      sanitized = sanitized.replace(pattern.regex, pattern.replacement);
    }
  }

  return { sanitized, hidden };
}

export const PRIVACY_DEFAULTS = {
  nickname: '',
  preferredName: '',
  replyStyle: 'gentle' as 'brief' | 'gentle' | 'action',
  allowSavePlan: false,
  allowSavePreferences: false,
};

export interface PrivacySettings {
  nickname: string;
  preferredName: string;
  replyStyle: 'brief' | 'gentle' | 'action';
  allowSavePlan: boolean;
  allowSavePreferences: boolean;
}

export function loadPrivacySettings(): PrivacySettings {
  try {
    const raw = localStorage.getItem('qingban_privacy_settings');
    if (raw) {
      return { ...PRIVACY_DEFAULTS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return { ...PRIVACY_DEFAULTS };
}

export function savePrivacySettings(settings: PrivacySettings): void {
  if (settings.allowSavePreferences) {
    localStorage.setItem('qingban_privacy_settings', JSON.stringify(settings));
  }
}

export function clearLocalData(): void {
  localStorage.removeItem('qingban_privacy_settings');
  localStorage.removeItem('qingban_plans');
  localStorage.removeItem('qingban_memory');
}
