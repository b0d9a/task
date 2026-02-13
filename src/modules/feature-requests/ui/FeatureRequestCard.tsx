import Link from 'next/link';
import type { FeatureRequestDTO } from '../application/dtos';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

export function FeatureRequestCard({ item }: { item: FeatureRequestDTO }) {
  return (
    <li className="rounded border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/feature-requests/${item.id}`}
          className="text-base font-semibold text-gray-900 hover:underline"
        >
          {item.title}
        </Link>
        <div className="flex shrink-0 gap-2">
          <StatusBadge status={item.status} />
          <PriorityBadge priority={item.priority} />
        </div>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{item.description}</p>
      <p className="mt-2 text-xs text-gray-400">
        Created {new Date(item.createdAt).toLocaleDateString('en-GB')}
      </p>
    </li>
  );
}
