import type { FeatureRequestDTO } from '../application/dtos';
import { FeatureRequestCard } from './FeatureRequestCard';

export function FeatureRequestList({ items }: { items: FeatureRequestDTO[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded border border-dashed border-gray-300 p-8 text-center text-gray-500">
        No feature requests yet.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <FeatureRequestCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
