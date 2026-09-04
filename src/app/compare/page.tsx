import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const ids = searchParams.ids?.split(',').filter(Boolean) || [];

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
  });

  if (colleges.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
        <p className="text-gray-500 text-sm">No colleges selected for comparison.</p>
        <Link href="/" className="text-blue-600 text-sm underline">Return home</Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Side-by-Side Comparison</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to search</Link>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 w-44 font-semibold text-gray-600">Metric</th>
              {colleges.map((c) => (
                <th key={c.id} className="p-4 font-bold text-gray-900">{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-4 font-medium text-gray-500">Location</td>
              {colleges.map((c) => <td key={c.id} className="p-4">{c.location}</td>)}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-500">Rating</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 font-semibold text-amber-700">★ {c.rating.toFixed(1)}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-500">Annual Fees</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4">₹{c.fees.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-500">Avg Placement</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4">₹{c.placementAvg.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-500">Highest Package</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4 font-bold text-emerald-600">₹{c.highestPackage.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-500">Courses</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-4">{c.courses.join(', ')}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}