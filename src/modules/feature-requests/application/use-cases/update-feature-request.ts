import { NotFoundError } from '../errors';
import type { FeatureRequestRepository } from '../../domain/repository';
import type { UpdateFeatureRequestInput, FeatureRequestDTO } from '../dtos';

export class UpdateFeatureRequestUseCase {
  constructor(private readonly repo: FeatureRequestRepository) {}

  async execute(id: string, input: UpdateFeatureRequestInput): Promise<FeatureRequestDTO> {
    const updated = await this.repo.update(id, input);
    if (!updated) throw new NotFoundError(id);
    return updated;
  }
}
