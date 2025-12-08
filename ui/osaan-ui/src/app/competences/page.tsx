"use client";

import { useQuery } from "@tanstack/react-query";
import { skillApi } from "@/lib/api-client";
import { useState } from "react";
import type { Skill } from "@/types/skill";

export default function CompetencesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["skills", { query: searchQuery, page }],
    queryFn: () =>
      skillApi.getSkills({
        query: searchQuery || undefined,
        page,
        size: 20,
      }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Competence Management
          </h1>
          <p className="mt-2 text-gray-600">
            Browse available skills and manage your competence profile
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0); // Reset to first page on search
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* Skills List */}
        <div className="bg-white rounded-lg shadow">
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading skills...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-800 font-semibold">
                Failed to load skills
              </p>
              <p className="mt-2 text-gray-600">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          )}

          {/* Skills Grid */}
          {data && !isLoading && (
            <>
              {data.skills.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No skills found</p>
                  {searchQuery && (
                    <p className="mt-2 text-sm">
                      Try adjusting your search query
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {data.skills.map((skill: Skill) => (
                      <div
                        key={skill.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {skill.id}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {data.page + 1} of {data.totalPages} (
                      {data.totalElements} total skills)
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={data.first}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={data.last}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Coming Soon
          </h2>
          <ul className="text-blue-800 space-y-1">
            <li>• Create and manage competence profiles</li>
            <li>• Rate your skills from 1 to 5</li>
            <li>• Link competences to employee profiles</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
