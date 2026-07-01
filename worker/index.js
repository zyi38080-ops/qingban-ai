/**
 * 晴伴AI - Cloudflare Worker 代理
 *
 * 将前端请求转发到阿里云百炼 DashScope API，
 * 避免前端直接暴露 API Key。
 *
 * 部署步骤：
 * 1. npm install -g wrangler
 * 2. wrangler login
 * 3. wrangler secret put DASHSCOPE_API_KEY
 * 4. wrangler deploy
 */

export default {
  async fetch(request, env, ctx) {
    // CORS 处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 仅允许 POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const DASHSCOPE_API_KEY = env.DASHSCOPE_API_KEY;
    if (!DASHSCOPE_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const body = await request.json();

      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: body.messages,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
