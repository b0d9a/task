import Link from 'next/link';
import { CreateFeatureRequestForm } from '@/modules/feature-requests/ui/CreateFeatureRequestForm';

export default function NewFeatureRequestPage() {
  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/feature-requests" className="text-sm text-gray-500 hover:text-gray-800">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">New Feature Request</h1>
      </div>
      <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        <CreateFeatureRequestForm />
      </div>
    </>
  );
}
