import { NotFoundError } from '../errors';
import type { FeatureRequestRepository } from '../../domain/repository';
import type { AddCommentInput, CommentDTO } from '../dtos';

export class AddCommentUseCase {
  constructor(private readonly repo: FeatureRequestRepository) {}

  async execute(featureRequestId: string, input: AddCommentInput): Promise<CommentDTO> {
    const fr = await this.repo.findById(featureRequestId);
    if (!fr) throw new NotFoundError(featureRequestId);

    const comment = {
      id: crypto.randomUUID(),
      featureRequestId,
      body: input.body,
      createdAt: new Date().toISOString(),
    };
    return this.repo.addComment(comment);
  }
}
