import type { Status } from '../domain/enums';

const colourMap: Record<Status, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  PLANNED: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  DONE: 'bg-green-100 text-green-800',
};

const labelMap: Record<Status, string> = {
  OPEN: 'Open',
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colourMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}
