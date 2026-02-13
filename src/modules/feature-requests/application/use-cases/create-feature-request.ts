import { Status } from '../../domain/enums';
import type { FeatureRequestRepository } from '../../domain/repository';
import type { CreateFeatureRequestInput, FeatureRequestDTO } from '../dtos';

export class CreateFeatureRequestUseCase {
  constructor(private readonly repo: FeatureRequestRepository) {}

  async execute(input: CreateFeatureRequestInput): Promise<FeatureRequestDTO> {
    const now = new Date().toISOString();
    const entity = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: Status.OPEN,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };
    return this.repo.save(entity);
  }
}
