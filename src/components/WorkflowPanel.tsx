import { Fragment } from 'react';

export default function WorkflowPanel() {
  const steps = [
    { label: '用户输入', icon: '💬' },
    { label: '隐私脱敏', icon: '🔒' },
    { label: '风险识别', icon: '⚠️' },
    { label: '知识库检索', icon: '📚' },
    { label: 'Qwen3.7-plus\n生成回答', icon: '🧠' },
    { label: '行动计划生成', icon: '📋' },
    { label: '用户授权后\n保存偏好', icon: '💾' },
  ];

  return (
    <div className="workflow-panel">
      <h4>⚙️ 系统工作流程</h4>
      <div className="workflow-steps">
        {steps.map((step, i) => (
          <Fragment key={i}>
            <div className="workflow-step">
              <span className="workflow-icon">{step.icon}</span>
              <span className="workflow-label">{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className="workflow-arrow">↓</div>}
          </Fragment>
        ))}
      </div>
      <div className="workflow-note">
        <p>LLM：阿里云百炼 Qwen3.7-plus</p>
        <p>工具：脱敏 · 风险识别 · 知识检索 · 行动计划 · 记忆</p>
        <p>知识库：本地 JSON（12条高质量知识片段）</p>
      </div>
    </div>
  );
}