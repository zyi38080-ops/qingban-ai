import { useState, useEffect } from 'react';
import { type PrivacySettings, loadPrivacySettings, savePrivacySettings, clearLocalData, PRIVACY_DEFAULTS } from '../utils/privacy';

const STYLE_OPTIONS = [
  { value: 'gentle', label: '🌿 温和', desc: '体贴细致，多一些关怀' },
  { value: 'brief', label: '💎 简洁', desc: '言简意赅，直达重点' },
  { value: 'action', label: '🎯 行动导向', desc: '聚焦解决方案和具体步骤' },
];

export default function PrivacyPanel() {
  const [settings, setSettings] = useState<PrivacySettings>(PRIVACY_DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadPrivacySettings());
  }, []);

  const update = (key: keyof PrivacySettings, value: string | boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    savePrivacySettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('确定要清空所有本地数据吗？此操作不可撤销。')) {
      clearLocalData();
      setSettings({ ...PRIVACY_DEFAULTS });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="privacy-panel">
      <h3>🔒 隐私中心</h3>
      <p className="privacy-subtitle">你的隐私，由你掌控。以下设置仅在本地浏览器生效。</p>

      <div className="privacy-default-note">
        💡 <strong>默认隐私保护：</strong>不保存聊天内容、不保存真实身份信息、不保存手机号/学校/住址/账号密码。
        用户未授权前，不保存任何记忆。
      </div>

      <div className="privacy-field">
        <label>📝 昵称（可选）</label>
        <input
          type="text"
          value={settings.nickname}
          onChange={(e) => update('nickname', e.target.value)}
          placeholder="输入一个代号即可，不必用真名"
          maxLength={20}
        />
      </div>

      <div className="privacy-field">
        <label>👋 希望被如何称呼</label>
        <input
          type="text"
          value={settings.preferredName}
          onChange={(e) => update('preferredName', e.target.value)}
          placeholder="如：小晴、同学"
          maxLength={10}
        />
      </div>

      <div className="privacy-field">
        <label>💬 回复风格偏好</label>
        <select
          value={settings.replyStyle}
          onChange={(e) => update('replyStyle', e.target.value)}
        >
          {STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label} — {opt.desc}</option>
          ))}
        </select>
      </div>

      <div className="privacy-field checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.allowSavePlan}
            onChange={(e) => update('allowSavePlan', e.target.checked)}
          />
          📋 允许保存行动计划到本地
        </label>
      </div>

      <div className="privacy-field checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.allowSavePreferences}
            onChange={(e) => update('allowSavePreferences', e.target.checked)}
          />
          💾 允许保存偏好设置（下次访问时恢复）
        </label>
      </div>

      <button className="clear-btn" onClick={handleClear}>
        🗑️ 清空所有本地数据
      </button>

      {saved && <div className="save-indicator">✅ 设置已保存</div>}
    </div>
  );
}