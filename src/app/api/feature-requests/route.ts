import { NextResponse, type NextRequest } from 'next/server';
import { featureRequestRepository } from '@/modules/feature-requests/infrastructure/in-memory-repository';
import { ListFeatureRequestsUseCase } from '@/modules/feature-requests/application/use-cases/list-feature-requests';
import { CreateFeatureRequestUseCase } from '@/modules/feature-requests/application/use-cases/create-feature-request';
import { CreateFeatureRequestSchema } from '@/modules/feature-requests/application/schemas';
import { errorResponse } from '@/lib/api-response';

export async function GET(): Promise<NextResponse> {
  try {
    const useCase = new ListFeatureRequestsUseCase(featureRequestRepository);
    const data = await useCase.execute();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const input = CreateFeatureRequestSchema.parse(body);
    const useCase = new CreateFeatureRequestUseCase(featureRequestRepository);
    const data = await useCase.execute(input);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
