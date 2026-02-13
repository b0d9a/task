'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Priority } from '../domain/enums';

export function CreateFeatureRequestForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
    };

    try {
      const res = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.error?.details?.fieldErrors) {
          setFieldErrors(body.error.details.fieldErrors);
        } else {
          setError(body.error?.message ?? 'Something went wrong');
        }
        return;
      }

      const created = await res.json();
      router.push(`/feature-requests/${created.id}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fieldErrors.title?.map((msg) => (
          <p key={msg} className="text-xs text-red-600">{msg}</p>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fieldErrors.description?.map((msg) => (
          <p key={msg} className="text-xs text-red-600">{msg}</p>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="priority" className="text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={Priority.MEDIUM}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(Priority).map((p) => (
            <option key={p} value={p}>
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Create Request'}
      </button>
    </form>
  );
}
