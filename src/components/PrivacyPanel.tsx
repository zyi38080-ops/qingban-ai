import { useState, useEffect } from 'react';
import { type PrivacySettings, loadPrivacySettings, savePrivacySettings, clearLocalData, PRIVACY_DEFAULTS } from '../utils/privacy';

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
      <h3>🔒 隐私设置</h3>
      <p className="privacy-default-note">
        默认不保存聊天内容、不保存真实身份信息。以下设置仅在您主动授权后生效。
      </p>

      <div className="privacy-field">
        <label>昵称（可选）</label>
        <input
          type="text"
          value={settings.nickname}
          onChange={(e) => update('nickname', e.target.value)}
          placeholder="输入一个代号即可"
          maxLength={20}
        />
      </div>

      <div className="privacy-field">
        <label>希望被如何称呼</label>
        <input
          type="text"
          value={settings.preferredName}
          onChange={(e) => update('preferredName', e.target.value)}
          placeholder="如：小晴、同学"
          maxLength={10}
        />
      </div>

      <div className="privacy-field">
        <label>回复风格</label>
        <select
          value={settings.replyStyle}
          onChange={(e) => update('replyStyle', e.target.value)}
        >
          <option value="gentle">温和</option>
          <option value="brief">简洁</option>
          <option value="action">行动导向</option>
        </select>
      </div>

      <div className="privacy-field checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.allowSavePlan}
            onChange={(e) => update('allowSavePlan', e.target.checked)}
          />
          允许保存行动计划
        </label>
      </div>

      <div className="privacy-field checkbox">
        <label>
          <input
            type="checkbox"
            checked={settings.allowSavePreferences}
            onChange={(e) => update('allowSavePreferences', e.target.checked)}
          />
          允许保存偏好设置
        </label>
      </div>

      <button className="clear-btn" onClick={handleClear}>
        🗑️ 清空本地数据
      </button>

      {saved && <div className="save-indicator">✓ 已保存</div>}
    </div>
  );
}