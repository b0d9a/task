import type { FeatureRequestDTO } from '../application/dtos';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

export function FeatureRequestDetail({ data }: { data: FeatureRequestDTO }) {
  return (
    <div className="mb-6 rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-3 text-2xl font-bold text-gray-900">{data.title}</h1>
      <div className="mb-4 flex gap-2">
        <StatusBadge status={data.status} />
        <PriorityBadge priority={data.priority} />
      </div>
      <p className="whitespace-pre-wrap text-gray-700">{data.description}</p>
      <div className="mt-4 flex gap-6 text-xs text-gray-400">
        <span>Created: {new Date(data.createdAt).toLocaleString('en-GB')}</span>
        <span>Updated: {new Date(data.updatedAt).toLocaleString('en-GB')}</span>
      </div>
    </div>
  );
}
