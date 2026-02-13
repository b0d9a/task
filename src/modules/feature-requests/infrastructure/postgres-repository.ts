import { sql, initDb } from '@/lib/db';
import type { FeatureRequestRepository } from '../domain/repository';
import type { FeatureRequest, Comment } from '../domain/entities';
import type { Status, Priority } from '../domain/enums';

let initialized = false;

async function ensureInit(): Promise<void> {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

function rowToFeatureRequest(row: Record<string, unknown>): FeatureRequest {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    status: row.status as Status,
    priority: row.priority as Priority,
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}

function rowToComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    featureRequestId: row.feature_request_id as string,
    body: row.body as string,
    createdAt: (row.created_at as Date).toISOString(),
  };
}

export class PostgresFeatureRequestRepository implements FeatureRequestRepository {
  async findAll(): Promise<FeatureRequest[]> {
    await ensureInit();
    const rows = await sql`
      SELECT * FROM feature_requests ORDER BY created_at DESC
    `;
    return rows.map((r) => rowToFeatureRequest(r as Record<string, unknown>));
  }

  async findById(id: string): Promise<FeatureRequest | null> {
    await ensureInit();
    const rows = await sql`
      SELECT * FROM feature_requests WHERE id = ${id}
    `;
    if (rows.length === 0) return null;
    return rowToFeatureRequest(rows[0] as Record<string, unknown>);
  }

  async save(fr: FeatureRequest): Promise<FeatureRequest> {
    await ensureInit();
    await sql`
      INSERT INTO feature_requests (id, title, description, status, priority, created_at, updated_at)
      VALUES (${fr.id}, ${fr.title}, ${fr.description}, ${fr.status}, ${fr.priority}, ${fr.createdAt}, ${fr.updatedAt})
    `;
    return fr;
  }

  async update(
    id: string,
    patch: { status?: Status; priority?: Priority },
  ): Promise<FeatureRequest | null> {
    await ensureInit();
    const existing = await this.findById(id);
    if (!existing) return null;

    const newStatus = patch.status ?? existing.status;
    const newPriority = patch.priority ?? existing.priority;
    const updatedAt = new Date().toISOString();

    const rows = await sql`
      UPDATE feature_requests
      SET status = ${newStatus}, priority = ${newPriority}, updated_at = ${updatedAt}
      WHERE id = ${id}
      RETURNING *
    `;
    return rowToFeatureRequest(rows[0] as Record<string, unknown>);
  }

  async addComment(comment: Comment): Promise<Comment> {
    await ensureInit();
    await sql`
      INSERT INTO comments (id, feature_request_id, body, created_at)
      VALUES (${comment.id}, ${comment.featureRequestId}, ${comment.body}, ${comment.createdAt})
    `;
    return comment;
  }

  async findCommentsByFeatureRequestId(featureRequestId: string): Promise<Comment[]> {
    await ensureInit();
    const rows = await sql`
      SELECT * FROM comments WHERE feature_request_id = ${featureRequestId} ORDER BY created_at ASC
    `;
    return rows.map((r) => rowToComment(r as Record<string, unknown>));
  }
}

export const featureRequestRepository: FeatureRequestRepository =
  new PostgresFeatureRequestRepository();
