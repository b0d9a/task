import type { Status, Priority } from './enums';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface Comment {
  id: string;
  featureRequestId: string;
  body: string;
  createdAt: string; // ISO 8601
}
