# 晴伴AI 部署指南

## 一、GitHub Pages 部署

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "晴伴AI 初始版本"
git branch -M main
git remote add origin https://github.com/你的用户名/qingban-ai.git
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入仓库 → Settings → Pages
2. Source 选择 "GitHub Actions"
3. 推送代码后自动触发 `.github/workflows/deploy.yml`
4. 等待部署完成，获得 URL：`https://你的用户名.github.io/qingban-ai/`

### 3. 手动部署

```bash
npm run build
# 将 dist/ 目录部署到任意静态服务器
```

## 二、Cloudflare Worker 部署

### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

### 2. 登录

```bash
wrangler login
```

### 3. 设置 API Key

```bash
cd worker
wrangler secret put DASHSCOPE_API_KEY
# 输入你的阿里云百炼 API Key
```

### 4. 部署

```bash
wrangler deploy
```

### 5. 获取 Worker URL

部署成功后获得 URL，形如：`https://qingban-ai-worker.你的子域名.workers.dev`

## 三、配置 API Key

### 获取阿里云百炼 API Key

1. 登录 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 进入 API Key 管理页面
3. 创建新的 API Key
4. 开通 Qwen3.7-plus 模型服务

### 填入 Worker

通过 `wrangler secret put DASHSCOPE_API_KEY` 设置，或直接在 Cloudflare Dashboard → Workers → 你的Worker → Settings → Variables 中添加。

## 四、开启 Demo Mode

### 前端 Demo Mode

在 `.env` 文件中设置：

```
VITE_DEMO_MODE=true
```

或构建时注入：

```bash
VITE_DEMO_MODE=true npm run build
```

Demo Mode 下前端使用本地固定回复，不调用任何外部 API。

## 五、连接 Worker 到前端

在 `.env` 中设置：

```
VITE_API_BASE_URL=https://你的worker.workers.dev
VITE_DEMO_MODE=false
```

重新构建后部署。

## 六、最终访问 URL

- **GitHub Pages**：`https://你的用户名.github.io/qingban-ai/`
- **本地开发**：`http://localhost:5173`
- **预览构建**：`npm run preview`

## 七、故障排查

| 问题 | 解决方案 |
|------|---------|
| 页面空白 | 检查 `vite.config.ts` 中 `base` 是否匹配仓库名 |
| API 调用失败 | 检查 Worker URL 和 API Key |
| CORS 错误 | Worker 已配置 CORS，检查 Worker 是否正常运行 |
| Demo Mode 不工作 | 确认 `VITE_DEMO_MODE=true` |
