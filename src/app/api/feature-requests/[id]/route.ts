import { NextResponse, type NextRequest } from 'next/server';
import { featureRequestRepository } from '@/modules/feature-requests/infrastructure/in-memory-repository';
import { GetFeatureRequestUseCase } from '@/modules/feature-requests/application/use-cases/get-feature-request';
import { UpdateFeatureRequestUseCase } from '@/modules/feature-requests/application/use-cases/update-feature-request';
import { IdParamSchema, UpdateFeatureRequestSchema } from '@/modules/feature-requests/application/schemas';
import { errorResponse } from '@/lib/api-response';

type RouteContext = { params: { id: string } };

export async function GET(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = IdParamSchema.parse(params);
    const useCase = new GetFeatureRequestUseCase(featureRequestRepository);
    const data = await useCase.execute(id);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  try {
    const { id } = IdParamSchema.parse(params);
    const body = await req.json();
    const input = UpdateFeatureRequestSchema.parse(body);
    const useCase = new UpdateFeatureRequestUseCase(featureRequestRepository);
    const data = await useCase.execute(id, input);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}
