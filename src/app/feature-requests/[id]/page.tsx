import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { DetailDTO } from '@/modules/feature-requests/application/dtos';
import { FeatureRequestDetail } from '@/modules/feature-requests/ui/FeatureRequestDetail';
import { UpdateStatusForm } from '@/modules/feature-requests/ui/UpdateStatusForm';
import { CommentList } from '@/modules/feature-requests/ui/CommentList';
import { AddCommentForm } from '@/modules/feature-requests/ui/AddCommentForm';

export const dynamic = 'force-dynamic';

async function fetchDetail(id: string): Promise<DetailDTO | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feature-requests/${id}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch feature request');
  return res.json();
}

export default async function FeatureRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const detail = await fetchDetail(params.id);
  if (!detail) notFound();

  const { featureRequest, comments } = detail;

  return (
    <>
      <div className="mb-6">
        <Link href="/feature-requests" className="text-sm text-gray-500 hover:text-gray-800">
          ← Back to list
        </Link>
      </div>

      <FeatureRequestDetail data={featureRequest} />

      <UpdateStatusForm
        id={featureRequest.id}
        currentStatus={featureRequest.status}
        currentPriority={featureRequest.priority}
      />

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">
          Comments ({comments.length})
        </h2>
        <CommentList comments={comments} />
        <AddCommentForm featureRequestId={featureRequest.id} />
      </section>
    </>
  );
}
