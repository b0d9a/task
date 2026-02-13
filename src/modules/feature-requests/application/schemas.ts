import { z } from 'zod';
import { Status, Priority } from '../domain/enums';

const statusValues = Object.values(Status) as [Status, ...Status[]];
const priorityValues = Object.values(Priority) as [Priority, ...Priority[]];

export const CreateFeatureRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title must be at most 120 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be at most 2000 characters'),
  priority: z.enum(priorityValues).default(Priority.MEDIUM),
});

export const UpdateFeatureRequestSchema = z
  .object({
    status: z.enum(statusValues).optional(),
    priority: z.enum(priorityValues).optional(),
  })
  .refine((data) => data.status !== undefined || data.priority !== undefined, {
    message: 'At least one of status or priority must be provided',
  });

export const AddCommentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be at most 1000 characters'),
});

export const IdParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
