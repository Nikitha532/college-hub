import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CollegeDetailPage({ params }: { params: { id: string } }) {
  const college = await prisma.college.findUnique({
    where: { id: params.id },
  });

  if (!college) notFound();

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to directory</Link>

      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{college.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{college.location}</p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-md">
            ★ {college.rating.toFixed(1)} / 5.0
          </span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">{college.overview}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Annual Tuition</div>
            <div className="text-lg font-bold text-gray-800 mt-1">₹{college.fees.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Average CTC</div>
            <div className="text-lg font-bold text-gray-800 mt-1">₹{college.placementAvg.toLocaleString()}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Highest Package</div>
            <div className="text-lg font-bold text-emerald-600 mt-1">₹{college.highestPackage.toLocaleString()}</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Available Branches</h3>
          <div className="flex flex-wrap gap-2">
            {college.courses.map((course) => (
              <span key={course} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}