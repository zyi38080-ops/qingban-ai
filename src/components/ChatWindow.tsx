import { useState, useRef, useEffect } from 'react';
import { sanitizeInput, type SanitizeResult } from '../utils/privacy';
import { classifyRisk } from '../utils/risk';
import { retrieveKnowledge, type KnowledgeItem, formatKnowledgeContext } from '../utils/knowledge';
import { createPlan, type ActionPlan } from '../utils/plan';
import { QINGBAN_SYSTEM_PROMPT, SAFETY_MESSAGE, DEMO_MODE_MESSAGE } from '../prompts/qingbanPrompt';
import PlanCard from './PlanCard';
import KnowledgeCard from './KnowledgeCard';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sanitizeResult?: SanitizeResult;
}

interface ChatWindowProps {
  isDemoMode: boolean;
}

const DEMO_REPLIES = [
  `【回应】
我能感受到你对自己晚上玩游戏到很晚这件事有些在意。很多人都有类似的体验——在夜晚，游戏确实更容易让人忘记时间。

【建议】
今晚可以试试设一个23:00的闹钟，闹钟响的时候先暂停游戏，喝水并站起来走一走，给自己10分钟来决定是否继续。

【下一步】
你想让我帮你制定一个具体的早睡行动计划吗？`,

  `【回应】
谢谢你愿意跟我聊这些。充值这件事确实容易在情绪波动的时候发生，这不代表你没有自控力。

【建议】
一个可以马上做的事情是：先关闭游戏内的快捷支付，给自己24小时冷静期，之后再决定是否购买。

【下一步】
你想了解"冲动充值后的冷静步骤"吗？或者想让我帮你制定一个充值冷静计划？`,

  `【回应】
你和父母因为游戏的事情有些不愉快，我能理解这种感受。两代人之间对于游戏的看法不同是很常见的。

【建议】
可以在一个双方都平静的时间，用"我感受到..."开头，把你想说的话先写下来，再找合适的时机沟通。

【下一步】
你愿意试试温和沟通计划吗？我可以帮你整理一个简单的步骤。`,

  `【回应】
我能感受到你现在有些烦躁，这种时候想打游戏来放松是很自然的反应。不过游戏有时会让情绪变得更激烈。

【建议】
试试暂停呼吸法：慢慢吸气4秒，屏气4秒，慢慢呼气6秒，做3-5次。这能让你的身体先平静下来。

【下一步】
你愿意告诉我是什么让你感到烦躁吗？或者想让我帮你做一个情绪调节计划？`,
];

let demoReplyIndex = 0;

export default function ChatWindow({ isDemoMode }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好，我是晴伴。我在这里陪你聊聊关于游戏、时间、心情或者你想聊的任何事情。你想从什么开始呢？',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showSafety, setShowSafety] = useState(false);
  const [sanitizeNotice, setSanitizeNotice] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    // 1. 隐私脱敏
    const sanitizeResult = sanitizeInput(userText);
    setSanitizeNotice(
      sanitizeResult.hidden.length > 0
        ? `系统已自动隐藏可能的敏感信息：${sanitizeResult.hidden.join('、')}`
        : ''
    );

    // 2. 风险识别
    const riskResult = classifyRisk(sanitizeResult.sanitized);
    if (riskResult.isHighRisk) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userText, sanitizeResult },
        { role: 'system', content: SAFETY_MESSAGE },
      ]);
      setShowSafety(true);
      setKnowledgeItems([]);
      setActionPlan(null);
      return;
    }
    setShowSafety(false);

    // 添加用户消息
    setMessages((prev) => [...prev, { role: 'user', content: userText, sanitizeResult }]);

    // 3. 知识库检索
    const knowledge = retrieveKnowledge(sanitizeResult.sanitized);
    setKnowledgeItems(knowledge);

    // 4. 行动计划
    const plan = createPlan(sanitizeResult.sanitized);
    setActionPlan(plan);

    setIsLoading(true);

    try {
      if (isDemoMode) {
        // Demo Mode: 轮换固定回复
        await new Promise((r) => setTimeout(r, 800));
        const reply = DEMO_REPLIES[demoReplyIndex % DEMO_REPLIES.length];
        demoReplyIndex++;
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } else {
        // 真实 API 调用
        const knowledgeContext = formatKnowledgeContext(knowledge);
        const fullPrompt = QINGBAN_SYSTEM_PROMPT.replace('{knowledgeContext}', knowledgeContext);

        const apiKey = import.meta.env.VITE_DASHSCOPE_API_KEY;
        const workerUrl = import.meta.env.VITE_API_BASE_URL;

        // 优先使用 Worker 代理，其次直接调用 DashScope（仅本地开发）
        let apiUrl: string;
        let headers: Record<string, string>;

        if (workerUrl) {
          // 通过 Cloudflare Worker 代理（生产环境）
          apiUrl = workerUrl;
          headers = { 'Content-Type': 'application/json' };
        } else if (apiKey) {
          // 直接调用 DashScope API（本地开发）
          apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
          headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          };
        } else {
          throw new Error('No API configuration');
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: 'qwen-plus',
            messages: [
              { role: 'system', content: fullPrompt },
              ...messages.slice(-6).map((m) => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
              { role: 'user', content: sanitizeResult.sanitized },
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        const assistantReply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回应，请稍后再试。';
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '抱歉，我暂时无法回应。请检查网络连接后重试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-role">
              {msg.role === 'user' ? '你' : msg.role === 'system' ? '⚠️ 系统' : '晴伴'}
            </div>
            <div className="message-content">
              {msg.content.split('\n').map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
            {msg.sanitizeResult && msg.sanitizeResult.hidden.length > 0 && (
              <div className="sanitize-badge">
                🔒 已隐藏：{msg.sanitizeResult.hidden.join('、')}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-role">晴伴</div>
            <div className="message-content typing">正在输入...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {sanitizeNotice && (
        <div className="privacy-notice">🔒 {sanitizeNotice}</div>
      )}

      {isDemoMode && (
        <div className="demo-mode-banner">📢 {DEMO_MODE_MESSAGE}</div>
      )}

      {knowledgeItems.length > 0 && <KnowledgeCard items={knowledgeItems} />}
      {actionPlan && <PlanCard plan={actionPlan} />}

      {showSafety && (
        <div className="safety-banner">
          ⚠️ 系统无法替代紧急帮助。如果你正在经历危险，请立即联系可信任的家人、老师或当地紧急服务。
        </div>
      )}

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="在这里输入你想说的话...（按 Enter 发送，Shift+Enter 换行）"
          rows={3}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}
