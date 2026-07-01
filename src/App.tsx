import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import PrivacyPanel from './components/PrivacyPanel';
import WorkflowPanel from './components/WorkflowPanel';
import { DISCLAIMER } from './prompts/qingbanPrompt';

const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'privacy' | 'workflow'>('chat');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">☀️</span> 晴伴AI
          </h1>
          <p className="app-subtitle">隐私可控的游戏行为陪伴与支持智能体</p>
        </div>
        <div className="disclaimer">{DISCLAIMER}</div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 陪聊
            </button>
            <button
              className={`nav-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              🔒 隐私
            </button>
            <button
              className={`nav-btn ${activeTab === 'workflow' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflow')}
            >
              ⚙️ 工作流
            </button>
          </nav>
        </aside>

        <main className="main-area">
          {activeTab === 'chat' && <ChatWindow isDemoMode={isDemoMode} />}
          {activeTab === 'privacy' && <PrivacyPanel />}
          {activeTab === 'workflow' && <WorkflowPanel />}
        </main>
      </div>

      <footer className="app-footer">
        <p>晴伴AI · 学术课程项目 · 不提供医疗诊断或心理治疗</p>
        <p className="footer-tech">
          LLM: Qwen3.7-plus · 前端: React + Vite + TypeScript · 部署: GitHub Pages
          {isDemoMode && ' · 当前为演示模式'}
        </p>
      </footer>
    </div>
  );
}