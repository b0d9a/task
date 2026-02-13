import type { Priority } from '../domain/enums';

const colourMap: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colourMap[priority]}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}
