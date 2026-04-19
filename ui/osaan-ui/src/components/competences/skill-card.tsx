'use client';

import { cn } from '@/lib/cn';
import type { Skill } from '@/types/skill';
import type { Rating } from '@/types/rating';
import { RatingControl } from './rating-control';

interface SkillCardProps {
  skill: Skill;
  selected: boolean;
  rating: Rating | null;
  onToggle: (skillId: string) => void;
  onRate: (skillId: string, rating: Rating) => void;
}

function SkillCard({ skill, selected, rating, onToggle, onRate }: SkillCardProps) {
  return (
    <div
      className={cn(
        'relative bg-white rounded-md border transition-all duration-150 p-4',
        'group cursor-pointer',
        selected
          ? 'border-saffron-600 border-2 bg-saffron-50 shadow-none'
          : 'border-stone-200 hover:border-stone-300'
      )}
      onClick={() => {
        if (!selected) onToggle(skill.id);
      }}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!selected) onToggle(skill.id);
        }
      }}
    >
      {/* Remove button — only when selected */}
      {selected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(skill.id);
          }}
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 transition-colors"
          aria-label={`Remove ${skill.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <p className={cn(
        'font-sans font-medium text-sm leading-snug',
        selected ? 'text-stone-950 pr-5' : 'text-stone-800'
      )}>
        {skill.name}
      </p>

      {/* Hover hint — only when not selected */}
      {!selected && (
        <p className="mt-1 text-xs text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 font-sans">
          Click to select
        </p>
      )}

      {/* Rating — slides in when selected */}
      <div
        className={cn(
          'expandable',
          selected ? 'expandable-open mt-3' : 'expandable-closed'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <RatingControl
          value={rating}
          onChange={(r) => onRate(skill.id, r)}
          size="sm"
        />
      </div>
    </div>
  );
}

export { SkillCard };
export type { SkillCardProps };
