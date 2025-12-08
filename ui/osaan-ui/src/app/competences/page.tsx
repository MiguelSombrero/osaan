'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkills } from '@/hooks/use-skills';
import TopBar from '@/components/top-bar';
import type { Skill } from '@/types/skill';

export default function CompetencesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useSkills({
    query: searchQuery || undefined,
    page,
    size: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar subtitle={t('browseSkills')} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchSkills')}
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
              <p className="mt-4 text-gray-600">{t('loading')}</p>
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
              <p className="text-red-800 font-semibold">{t('loadingError')}</p>
              <p className="mt-2 text-gray-600">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )}

          {/* Skills Grid */}
          {data && !isLoading && (
            <>
              {data.skills.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>{t('noSkills')}</p>
                  {searchQuery && (
                    <p className="mt-2 text-sm">{t('adjustSearch')}</p>
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
                      {t('showingPage', {
                        page: data.page + 1,
                        totalPages: data.totalPages,
                        totalElements: data.totalElements,
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={data.first}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                      >
                        {t('previous')}
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={data.last}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
