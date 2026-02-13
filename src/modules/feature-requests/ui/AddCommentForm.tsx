'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function AddCommentForm({ featureRequestId }: { featureRequestId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value;

    try {
      const res = await fetch(`/api/feature-requests/${featureRequestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error?.message ?? 'Failed to add comment');
        return;
      }

      form.reset();
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-700">Add a Comment</h2>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <textarea
        name="body"
        rows={3}
        required
        placeholder="Write a comment…"
        className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded bg-gray-800 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Post Comment'}
      </button>
    </form>
  );
}
