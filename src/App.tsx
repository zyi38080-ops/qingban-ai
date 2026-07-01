import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import PrivacyPanel from './components/PrivacyPanel';
import WorkflowPanel from './components/WorkflowPanel';
import { DISCLAIMER } from './prompts/qingbanPrompt';

const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

const FEATURES = [
  { icon: '🔒', label: '隐私脱敏', desc: '自动隐藏敏感信息' },
  { icon: '⚠️', label: '风险识别', desc: '高风险内容安全分流' },
  { icon: '📚', label: '知识库', desc: '12条专业行为支持知识' },
  { icon: '📋', label: '行动计划', desc: '智能生成行动方案' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'privacy' | 'workflow'>('chat');

  return (
    <div className="app">
      {/* ====== 顶部导航栏 ====== */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon">☀️</div>
            <div className="brand-text">
              <h1 className="app-title">晴伴AI</h1>
              <p className="app-subtitle">隐私可控的游戏行为陪伴与支持智能体</p>
            </div>
          </div>

          <nav className="header-nav">
            <button
              className={`nav-pill ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span className="nav-pill-icon">💬</span>
              <span>智能陪聊</span>
            </button>
            <button
              className={`nav-pill ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="nav-pill-icon">🔒</span>
              <span>隐私中心</span>
            </button>
            <button
              className={`nav-pill ${activeTab === 'workflow' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflow')}
            >
              <span className="nav-pill-icon">⚙️</span>
              <span>系统架构</span>
            </button>
          </nav>

          <div className="header-status">
            <span className={`status-dot ${isDemoMode ? 'demo' : 'live'}`} />
            <span className="status-text">{isDemoMode ? '演示模式' : 'Qwen 在线'}</span>
          </div>
        </div>

        <div className="disclaimer-bar">{DISCLAIMER}</div>
      </header>

      {/* ====== 功能特性栏 ====== */}
      <div className="features-strip">
        {FEATURES.map((f) => (
          <div key={f.label} className="feature-chip">
            <span className="feature-chip-icon">{f.icon}</span>
            <div>
              <div className="feature-chip-label">{f.label}</div>
              <div className="feature-chip-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ====== 主体内容 ====== */}
      <div className="app-body">
        <main className="main-area">
          {activeTab === 'chat' && <ChatWindow isDemoMode={isDemoMode} />}
          {activeTab === 'privacy' && <PrivacyPanel />}
          {activeTab === 'workflow' && <WorkflowPanel />}
        </main>
      </div>

      {/* ====== 页脚 ====== */}
      <footer className="app-footer">
        <div className="footer-inner">
          <span>晴伴AI · 学术课程项目</span>
          <span className="footer-sep">·</span>
          <span>LLM: Qwen3.7-plus</span>
          <span className="footer-sep">·</span>
          <span>React + Vite + TypeScript</span>
          <span className="footer-sep">·</span>
          <span>不提供医疗诊断或心理治疗</span>
          {isDemoMode && (
            <>
              <span className="footer-sep">·</span>
              <span className="footer-demo-tag">演示模式</span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
