import type { ActionPlan } from '../utils/plan';

interface PlanCardProps {
  plan: ActionPlan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="plan-card">
      <h4>📋 {plan.title}</h4>
      <ol className="plan-steps">
        {plan.steps.map((step) => (
          <li key={step.order}>{step.description}</li>
        ))}
      </ol>
      <p className="plan-tip">💡 你可以试试完成前两步，感受一下变化。</p>
    </div>
  );
}
