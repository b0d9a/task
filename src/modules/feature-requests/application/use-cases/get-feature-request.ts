import { NotFoundError } from '../errors';
import type { FeatureRequestRepository } from '../../domain/repository';
import type { DetailDTO } from '../dtos';

export class GetFeatureRequestUseCase {
  constructor(private readonly repo: FeatureRequestRepository) {}

  async execute(id: string): Promise<DetailDTO> {
    const featureRequest = await this.repo.findById(id);
    if (!featureRequest) throw new NotFoundError(id);
    const comments = await this.repo.findCommentsByFeatureRequestId(id);
    return { featureRequest, comments };
  }
}
