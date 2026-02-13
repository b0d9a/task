import Link from 'next/link';
import type { FeatureRequestDTO } from '@/modules/feature-requests/application/dtos';
import { FeatureRequestList } from '@/modules/feature-requests/ui/FeatureRequestList';

export const dynamic = 'force-dynamic';

async function fetchFeatureRequests(): Promise<FeatureRequestDTO[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feature-requests`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function FeatureRequestsPage() {
  const items = await fetchFeatureRequests();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feature Requests</h1>
        <Link
          href="/feature-requests/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Request
        </Link>
      </div>
      <FeatureRequestList items={items} />
    </>
  );
}
