import Link from 'next/link';
import { notFound } from 'next/navigation';
import { featureRequestRepository } from '@/modules/feature-requests/infrastructure/postgres-repository';
import { GetFeatureRequestUseCase } from '@/modules/feature-requests/application/use-cases/get-feature-request';
import { NotFoundError } from '@/modules/feature-requests/application/errors';
import { FeatureRequestDetail } from '@/modules/feature-requests/ui/FeatureRequestDetail';
import { UpdateStatusForm } from '@/modules/feature-requests/ui/UpdateStatusForm';
import { CommentList } from '@/modules/feature-requests/ui/CommentList';
import { AddCommentForm } from '@/modules/feature-requests/ui/AddCommentForm';

export const dynamic = 'force-dynamic';

export default async function FeatureRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let detail;
  try {
    const useCase = new GetFeatureRequestUseCase(featureRequestRepository);
    detail = await useCase.execute(params.id);
  } catch (err) {
    if (err instanceof NotFoundError || (err instanceof Error && 'code' in err && (err as { code: string }).code === 'NOT_FOUND')) notFound();
    throw err;
  }

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
