'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placementAvg: number;
  highestPackage?: number;
  courses?: string[];
}

export default function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?q=${encodeURIComponent(search)}&sortBy=${sortBy}`);
        const data = await res.json();
        setColleges(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchColleges(), 250);
    return () => clearTimeout(timer);
  }, [search, sortBy]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare a maximum of 3 colleges at once.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparedColleges = colleges.filter((c) => selectedIds.includes(c.id));

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">College Discovery Platform</h1>
        <p className="text-gray-500 text-sm mt-1">Explore, filter, and compare top institutions.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by college name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 bg-white focus:outline-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900"
        >
          <option value="rating">Sort by Highest Rating</option>
          <option value="fees">Sort by Lowest Fees</option>
        </select>
      </div>

      {/* Floating Compare Tray */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-4 z-40">
          <span className="text-sm font-medium">{selectedIds.length} of 3 selected</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition"
          >
            Compare Now →
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">College Comparison</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="p-3 text-sm font-semibold text-gray-500 w-1/4">Metric</th>
                    {comparedColleges.map((c) => (
                      <th key={c.id} className="p-3 text-base font-bold text-gray-900">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr>
                    <td className="p-3 text-gray-500 font-medium">Location</td>
                    {comparedColleges.map((c) => (
                      <td key={c.id} className="p-3 text-gray-800">{c.location}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-500 font-medium">Rating</td>
                    {comparedColleges.map((c) => (
                      <td key={c.id} className="p-3 text-amber-700 font-bold">
                        ★ {Number(c.rating).toFixed(1)} / 5.0
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-500 font-medium">Annual Tuition</td>
                    {comparedColleges.map((c) => (
                      <td key={c.id} className="p-3 text-gray-900 font-semibold">
                        ₹{Number(c.fees).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-500 font-medium">Avg. Placement</td>
                    {comparedColleges.map((c) => (
                      <td key={c.id} className="p-3 text-emerald-600 font-bold">
                        ₹{Number(c.placementAvg).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-500 font-medium">Action</td>
                    {comparedColleges.map((c) => (
                      <td key={c.id} className="p-3">
                        <Link
                          href={`/colleges/${c.id}`}
                          className="text-xs text-blue-600 hover:underline font-semibold"
                        >
                          View Full Profile →
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading colleges...</p>
      ) : colleges.length === 0 ? (
        <p className="text-gray-500 text-sm">No colleges match your search criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <div
              key={college.id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded">
                    ★ {Number(college.rating).toFixed(1)}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(college.id)}
                      onChange={() => toggleSelect(college.id)}
                      className="rounded"
                    />
                    Compare
                  </label>
                </div>
                <h2 className="font-semibold text-lg text-gray-900 hover:text-blue-600">
                  <Link href={`/colleges/${college.id}`}>{college.name}</Link>
                </h2>
                <p className="text-gray-500 text-xs mt-1">{college.location}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block">Annual Fees</span>
                  <span className="font-semibold text-gray-700">₹{Number(college.fees).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Avg. Placement</span>
                  <span className="font-semibold text-gray-700">₹{Number(college.placementAvg).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}