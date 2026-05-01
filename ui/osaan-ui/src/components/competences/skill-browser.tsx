'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkills } from '@/hooks/use-skills';
import { SearchInput, Spinner, EmptyState, ErrorState, Pagination } from '@/components/ui';
import { SkillCard } from './skill-card';
import type { Rating } from '@/types/rating';

interface SkillBrowserProps {
  selectedSkills: Map<string, Rating | null>;
  onToggle: (skillId: string) => void;
  onRate: (skillId: string, rating: Rating) => void;
}

function SkillBrowser({ selectedSkills, onToggle, onRate }: SkillBrowserProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  const { data, isLoading, error, refetch } = useSkills({
    query: searchQuery || undefined,
    page,
    size: 12,
  });

  return (
    <div>
      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('searchSkills')}
          className="max-w-md"
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-stone-600 font-sans">{t('loading')}</p>
          </div>
        )}

        {error && !isLoading && (
          <ErrorState
            title={t('loadingError')}
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && (
          <>
            {data.skills.length === 0 ? (
              <EmptyState
                title={t('noSkills')}
                description={searchQuery ? t('adjustSearch') : undefined}
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 p-5">
                  {data.skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      selected={selectedSkills.has(skill.id)}
                      rating={selectedSkills.get(skill.id) ?? null}
                      onToggle={onToggle}
                      onRate={onRate}
                    />
                  ))}
                </div>
                {data.totalPages > 1 && (
                  <Pagination
                    page={data.page}
                    totalPages={data.totalPages}
                    totalElements={data.totalElements}
                    onPrev={() => setPage((p) => p - 1)}
                    onNext={() => setPage((p) => p + 1)}
                    isFirst={data.first}
                    isLast={data.last}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { SkillBrowser };
