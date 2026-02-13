import type { Status, Priority } from './enums';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  featureRequestId: string;
  body: string;
  createdAt: string; 
}
