# 晴伴AI — 隐私可控的游戏行为陪伴与支持智能体

晴伴AI是一个面向青少年游戏行为失控场景的专业陪伴智能体。通过陪伴式对话帮助用户梳理游戏行为问题，基于知识库提供可信建议，并生成简单的行动计划。

## 🎯 项目定位

- **不是**普通娱乐聊天机器人，不是游戏，不是办公软件
- **是**一个面向"游戏时间失控、冲动充值、熬夜玩游戏、与父母因游戏发生冲突"等场景的陪伴智能体
- **不提供**医疗诊断或心理治疗

## 🏗 技术栈

| 层级 | 技术 |
|------|------|
| LLM | 阿里云百炼 Qwen3.7-plus |
| 前端 | React 19 + Vite + TypeScript |
| 代理 | Cloudflare Worker |
| 部署 | GitHub Pages |
| 知识库 | 本地 JSON (12条) |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

### 3. 本地运行（Demo Mode）

默认以 Demo Mode 运行，使用本地固定回复，不需要 API Key：

```bash
npm run dev
```

访问 http://localhost:5173

### 4. 接入真实 Qwen 模型

参见 [docs/deployment.md](docs/deployment.md)

## 📁 项目结构

```
├── src/
│   ├── components/
│   │   ├── ChatWindow.tsx      # 聊天窗口
│   │   ├── PrivacyPanel.tsx     # 隐私设置面板
│   │   ├── PlanCard.tsx         # 行动计划卡
│   │   ├── KnowledgeCard.tsx    # 知识库展示卡
│   │   └── WorkflowPanel.tsx    # 工作流展示
│   ├── utils/
│   │   ├── privacy.ts           # 隐私脱敏
│   │   ├── risk.ts              # 风险识别
│   │   ├── knowledge.ts         # 知识库检索
│   │   ├── plan.ts              # 行动计划生成
│   │   └── memory.ts            # 本地记忆管理
│   ├── prompts/
│   │   └── qingbanPrompt.ts     # 系统提示词
│   ├── data/
│   │   └── knowledge.json       # 知识库
│   ├── App.tsx
│   └── main.tsx
├── worker/
│   └── index.js                 # Cloudflare Worker
├── docs/                        # 文档
├── .github/workflows/deploy.yml # 自动部署
└── .env.example
```

## 📄 许可证

学术课程项目，仅供学习使用。
