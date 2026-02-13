import type { FeatureRequest, Comment } from './entities';
import type { Status, Priority } from './enums';

export interface FeatureRequestRepository {
  findAll(): Promise<FeatureRequest[]>;
  findById(id: string): Promise<FeatureRequest | null>;
  save(fr: FeatureRequest): Promise<FeatureRequest>;
  update(
    id: string,
    patch: { status?: Status; priority?: Priority },
  ): Promise<FeatureRequest | null>;
  addComment(comment: Comment): Promise<Comment>;
  findCommentsByFeatureRequestId(featureRequestId: string): Promise<Comment[]>;
}
