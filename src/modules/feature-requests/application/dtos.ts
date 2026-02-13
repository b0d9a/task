import type { z } from 'zod';
import type {
  CreateFeatureRequestSchema,
  UpdateFeatureRequestSchema,
  AddCommentSchema,
} from './schemas';
import type { FeatureRequest, Comment } from '../domain/entities';

export type CreateFeatureRequestInput = z.infer<typeof CreateFeatureRequestSchema>;
export type UpdateFeatureRequestInput = z.infer<typeof UpdateFeatureRequestSchema>;
export type AddCommentInput = z.infer<typeof AddCommentSchema>;

export type FeatureRequestDTO = FeatureRequest;
export type CommentDTO = Comment;

export interface DetailDTO {
  featureRequest: FeatureRequestDTO;
  comments: CommentDTO[];
}
