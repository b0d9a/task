import { describe, it, expect, beforeEach } from 'vitest';
import { CreateFeatureRequestUseCase } from '../use-cases/create-feature-request';
import { Status, Priority } from '../../domain/enums';
import type { FeatureRequestRepository } from '../../domain/repository';
import type { FeatureRequest, Comment } from '../../domain/entities';

class StubRepository implements FeatureRequestRepository {
  private store: FeatureRequest[] = [];

  async findAll() {
    return this.store;
  }
  async findById(id: string) {
    return this.store.find((f) => f.id === id) ?? null;
  }
  async save(fr: FeatureRequest) {
    this.store.push(fr);
    return fr;
  }
  async update() {
    return null;
  }
  async addComment(c: Comment) {
    return c;
  }
  async findCommentsByFeatureRequestId() {
    return [];
  }
}

describe('CreateFeatureRequestUseCase', () => {
  let repo: StubRepository;
  let useCase: CreateFeatureRequestUseCase;

  beforeEach(() => {
    repo = new StubRepository();
    useCase = new CreateFeatureRequestUseCase(repo);
  });

  it('creates a feature request with OPEN status and a valid UUID', async () => {
    const result = await useCase.execute({
      title: 'Export to CSV',
      description: 'Users need to export their data as CSV files',
      priority: Priority.HIGH,
    });

    expect(result.status).toBe(Status.OPEN);
    expect(result.priority).toBe(Priority.HIGH);
    expect(result.title).toBe('Export to CSV');
    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(result.createdAt).toBe(result.updatedAt);
  });

  it('persists the entity in the repository', async () => {
    await useCase.execute({
      title: 'Dark mode',
      description: 'Add a dark mode toggle to the settings page',
      priority: Priority.MEDIUM,
    });

    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe('Dark mode');
  });
});
