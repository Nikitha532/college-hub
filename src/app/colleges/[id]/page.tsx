import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const college = await prisma.college.findUnique({
    where: { id },
  });

  if (!college) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to directory
      </Link>

      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{college.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{college.location}</p>
          </div>
          <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-md">
            ★ {college.rating ? Number(college.rating).toFixed(1) : 'N/A'} / 5.0
          </span>
        </div>

        {college.overview && (
          <p className="text-gray-700 text-sm leading-relaxed">{college.overview}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Annual Tuition</div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              ₹{college.fees ? Number(college.fees).toLocaleString() : 'N/A'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Average CTC</div>
            <div className="text-lg font-bold text-gray-800 mt-1">
              ₹{college.placementAvg ? Number(college.placementAvg).toLocaleString() : 'N/A'}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500">Highest Package</div>
            <div className="text-lg font-bold text-emerald-600 mt-1">
              ₹{college.highestPackage ? Number(college.highestPackage).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>

        {Array.isArray(college.courses) && college.courses.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Available Branches</h3>
            <div className="flex flex-wrap gap-2">
              {college.courses.map((course: string) => (
                <span key={course} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}