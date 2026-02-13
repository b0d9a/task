import type { FeatureRequestRepository } from '../domain/repository';
import type { FeatureRequest, Comment } from '../domain/entities';
import type { Status, Priority } from '../domain/enums';

class InMemoryFeatureRequestRepository implements FeatureRequestRepository {
  private featureRequests: Map<string, FeatureRequest> = new Map();
  private comments: Map<string, Comment[]> = new Map();

  async findAll(): Promise<FeatureRequest[]> {
    return Array.from(this.featureRequests.values());
  }

  async findById(id: string): Promise<FeatureRequest | null> {
    return this.featureRequests.get(id) ?? null;
  }

  async save(fr: FeatureRequest): Promise<FeatureRequest> {
    this.featureRequests.set(fr.id, { ...fr });
    this.comments.set(fr.id, []);
    return fr;
  }

  async update(
    id: string,
    patch: { status?: Status; priority?: Priority },
  ): Promise<FeatureRequest | null> {
    const existing = this.featureRequests.get(id);
    if (!existing) return null;
    const updated: FeatureRequest = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.featureRequests.set(id, updated);
    return updated;
  }

  async addComment(comment: Comment): Promise<Comment> {
    const bucket = this.comments.get(comment.featureRequestId) ?? [];
    bucket.push({ ...comment });
    this.comments.set(comment.featureRequestId, bucket);
    return comment;
  }

  async findCommentsByFeatureRequestId(featureRequestId: string): Promise<Comment[]> {
    return this.comments.get(featureRequestId) ?? [];
  }
}

interface GlobalWithRepo {
  _featureRequestRepo?: InMemoryFeatureRequestRepository;
}

const g = globalThis as unknown as GlobalWithRepo;

const repo: InMemoryFeatureRequestRepository =
  g._featureRequestRepo ?? new InMemoryFeatureRequestRepository();

if (process.env.NODE_ENV !== 'production') {
  g._featureRequestRepo = repo;
}

export const featureRequestRepository: FeatureRequestRepository = repo;
