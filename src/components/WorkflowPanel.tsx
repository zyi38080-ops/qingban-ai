import { Fragment } from 'react';

const STEPS = [
  { label: '用户输入', icon: '💬', desc: '用户在聊天框输入文本' },
  { label: '隐私脱敏', icon: '🔒', desc: '自动识别并隐藏敏感信息' },
  { label: '风险识别', icon: '⚠️', desc: '关键词规则判断高风险表达' },
  { label: '知识库检索', icon: '📚', desc: '匹配相关知识片段（最多2条）' },
  { label: 'Qwen3.7-plus\n生成回答', icon: '🧠', desc: 'LLM 结合上下文生成回复' },
  { label: '行动计划生成', icon: '📋', desc: '基于规则模板生成行动建议' },
  { label: '用户授权后\n保存偏好', icon: '💾', desc: '仅在用户主动授权后存储' },
];

export default function WorkflowPanel() {
  return (
    <div className="workflow-panel">
      <h4>⚙️ 系统架构</h4>
      <p className="workflow-subtitle">智能体 = LLM + 工具 + 知识库 + 工作流</p>

      <div className="workflow-steps">
        {STEPS.map((step, i) => (
          <Fragment key={i}>
            <div className="workflow-step" title={step.desc}>
              <span className="workflow-icon">{step.icon}</span>
              <span className="workflow-label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="workflow-arrow">↓</div>}
          </Fragment>
        ))}
      </div>

      <div className="workflow-note">
        <p>LLM：阿里云百炼 Qwen3.7-plus（qwen-plus 兼容模式）</p>
        <p>工具：脱敏 · 风险识别 · 知识检索 · 行动计划 · LocalStorage 记忆</p>
        <p>知识库：本地 JSON（12条高质量知识片段）</p>
        <p>代理：Cloudflare Worker（保护 API Key，解决跨域）</p>
        <p>部署：GitHub Pages 静态托管 + GitHub Actions 自动构建</p>
      </div>
    </div>
  );
}