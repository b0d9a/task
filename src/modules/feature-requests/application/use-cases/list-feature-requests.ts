import type { FeatureRequestRepository } from '../../domain/repository';
import type { FeatureRequestDTO } from '../dtos';

export class ListFeatureRequestsUseCase {
  constructor(private readonly repo: FeatureRequestRepository) {}

  async execute(): Promise<FeatureRequestDTO[]> {
    const all = await this.repo.findAll();
    return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
