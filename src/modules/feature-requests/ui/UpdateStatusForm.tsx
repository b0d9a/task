'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Status, Priority } from '../domain/enums';

interface Props {
  id: string;
  currentStatus: Status;
  currentPriority: Priority;
}

export function UpdateStatusForm({ id, currentStatus, currentPriority }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus);
  const [priority, setPriority] = useState<Priority>(currentPriority);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/feature-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error?.message ?? 'Update failed');
        return;
      }

      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-wrap items-end gap-4 rounded border border-gray-200 bg-gray-50 p-4"
    >
      <h2 className="w-full text-sm font-semibold text-gray-700">Update Status / Priority</h2>

      {error && <p className="w-full text-xs text-red-600">{error}</p>}

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-xs font-medium text-gray-600">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.values(Status).map((s) => (
            <option key={s} value={s}>
              {s === 'IN_PROGRESS' ? 'In Progress' : s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="priority" className="text-xs font-medium text-gray-600">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
