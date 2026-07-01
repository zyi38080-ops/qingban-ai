/**
 * 轻量记忆工具
 * 使用 LocalStorage 保存用户授权后的偏好
 */

export interface MemoryItem {
  key: string;
  value: string;
  timestamp: number;
}

export function saveMemory(key: string, value: string): void {
  try {
    const settings = localStorage.getItem('qingban_privacy_settings');
    if (!settings) return;
    const parsed = JSON.parse(settings);
    if (!parsed.allowSavePreferences) return;

    const memory: MemoryItem[] = JSON.parse(
      localStorage.getItem('qingban_memory') || '[]'
    );
    memory.push({ key, value, timestamp: Date.now() });
    // 最多保存20条
    if (memory.length > 20) {
      memory.shift();
    }
    localStorage.setItem('qingban_memory', JSON.stringify(memory));
  } catch {
    // ignore
  }
}

export function loadMemory(): MemoryItem[] {
  try {
    return JSON.parse(localStorage.getItem('qingban_memory') || '[]');
  } catch {
    return [];
  }
}

export function hasMemoryPermission(): boolean {
  try {
    const settings = localStorage.getItem('qingban_privacy_settings');
    if (!settings) return false;
    return JSON.parse(settings).allowSavePreferences === true;
  } catch {
    return false;
  }
}