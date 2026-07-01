import type { KnowledgeItem } from '../utils/knowledge';

interface KnowledgeCardProps {
  items: KnowledgeItem[];
}

export default function KnowledgeCard({ items }: KnowledgeCardProps) {
  return (
    <div className="knowledge-card">
      <h4>📚 参考建议</h4>
      <ul className="knowledge-list">
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.content}</p>
            <span className="knowledge-source">来源：{item.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
