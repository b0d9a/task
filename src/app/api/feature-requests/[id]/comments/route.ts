import { NextResponse, type NextRequest } from 'next/server';
import { featureRequestRepository } from '@/modules/feature-requests/infrastructure/postgres-repository';
import { AddCommentUseCase } from '@/modules/feature-requests/application/use-cases/add-comment';
import { IdParamSchema, AddCommentSchema } from '@/modules/feature-requests/application/schemas';
import { errorResponse } from '@/lib/api-response';

type RouteContext = { params: { id: string } };

export async function POST(
  req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = IdParamSchema.parse(params);
    const body = await req.json();
    const input = AddCommentSchema.parse(body);
    const useCase = new AddCommentUseCase(featureRequestRepository);
    const data = await useCase.execute(id, input);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
