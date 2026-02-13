import type { CommentDTO } from '../application/dtos';

export function CommentList({ comments }: { comments: CommentDTO[] }) {
  if (comments.length === 0) {
    return (
      <p className="mb-4 text-sm text-gray-400">No comments yet. Be the first to comment.</p>
    );
  }

  return (
    <ul className="mb-4 flex flex-col gap-3">
      {comments.map((c) => (
        <li key={c.id} className="rounded border border-gray-200 bg-white p-4 text-sm">
          <p className="whitespace-pre-wrap text-gray-800">{c.body}</p>
          <p className="mt-2 text-xs text-gray-400">
            {new Date(c.createdAt).toLocaleString('en-GB')}
          </p>
        </li>
      ))}
    </ul>
  );
}
