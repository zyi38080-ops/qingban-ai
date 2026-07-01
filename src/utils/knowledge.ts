/**
 * 轻量知识库检索工具
 * 基于关键词匹配
 */

import knowledgeData from '../data/knowledge.json';

export interface KnowledgeItem {
  id: string;
  title: string;
  keywords: string[];
  content: string;
  source: string;
}

const knowledgeBase: KnowledgeItem[] = knowledgeData as KnowledgeItem[];

/**
 * 检索相关知识条目
 * @param query 用户查询内容
 * @param maxResults 最大返回条数
 * @returns 匹配的知识条目
 */
export function retrieveKnowledge(query: string, maxResults: number = 2): KnowledgeItem[] {
  if (!query.trim()) return [];

  const lower = query.toLowerCase();
  const scored = knowledgeBase.map((item) => {
    let score = 0;
    for (const kw of item.keywords) {
      if (lower.includes(kw)) score += 1;
    }
    // 标题匹配权重更高
    if (lower.includes(item.title.slice(0, 4))) score += 2;
    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.item);
}

/**
 * 将知识库内容格式化为上下文
 */
export function formatKnowledgeContext(items: KnowledgeItem[]): string {
  if (items.length === 0) return '暂无相关知识匹配。';
  return items.map((item) => `- ${item.title}：${item.content}`).join('\n');
}