'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { EmployeeSearchResult } from '@/types/manager';
import type { Rating } from '@/types/rating';

interface TeamSkill {
  skillId: string;
  skillName: string;
  maxRating: number;
  employees: Array<{
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
  }>;
}

function buildTeamSkills(selected: EmployeeSearchResult[]): TeamSkill[] {
  const map = new Map<string, TeamSkill>();

  for (const employee of selected) {
    for (const ms of employee.matchedSkills ?? []) {
      const existing = map.get(ms.skillId);
      const emp = {
        id: employee.id!,
        firstName: employee.firstName,
        lastName: employee.lastName,
        rating: ms.rating,
      };
      if (existing) {
        const alreadyAdded = existing.employees.some((e) => e.id === emp.id);
        if (!alreadyAdded) existing.employees.push(emp);
        if (ms.rating > existing.maxRating) existing.maxRating = ms.rating;
      } else {
        map.set(ms.skillId, {
          skillId: ms.skillId,
          skillName: ms.skillName,
          maxRating: ms.rating,
          employees: [emp],
        });
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.maxRating - a.maxRating || a.skillName.localeCompare(b.skillName)
  );
}

function RatingDots({ rating, maxRating, size = 7 }: { rating: number; maxRating?: number; size?: number }) {
  const color = maxRating ?? rating;
  return (
    <span className="flex items-center gap-0.5">
      {([1, 2, 3, 4, 5] as Rating[]).map((level) => (
        <span
          key={level}
          className="block rounded-full shrink-0"
          style={{
            width: size,
            height: size,
            backgroundColor:
              level <= rating ? `var(--rating-${color})` : 'transparent',
            border: `1.5px solid ${
              level <= rating ? `var(--rating-${color})` : 'var(--border-subtle)'
            }`,
          }}
        />
      ))}
    </span>
  );
}

interface TeamSkillCardProps {
  skill: TeamSkill;
  index: number;
}

function TeamSkillCard({ skill, index }: TeamSkillCardProps) {
  const { t } = useTranslation();
  const sortedEmployees = [...skill.employees].sort((a, b) => b.rating - a.rating);
  const maxLabel = t(`rating${skill.maxRating}`, { defaultValue: String(skill.maxRating) });
  const memberLabel =
    skill.employees.length === 1
      ? t('teamMemberSingle', { defaultValue: '1 person' })
      : t('teamMemberPlural', {
          defaultValue: `${skill.employees.length} people`,
          count: skill.employees.length,
        });

  return (
    <div
      className="bg-white rounded-md border border-stone-200 overflow-hidden team-skill-card"
      style={{
        borderLeft: `3px solid var(--rating-${skill.maxRating})`,
        animationDelay: `${index * 40}ms`,
      }}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-display font-medium text-stone-950 text-[15px] leading-tight">
            {skill.skillName}
          </h4>
          <RatingDots rating={skill.maxRating} size={7} />
        </div>
        <p className="text-xs text-stone-400 font-sans mt-1 tabular-nums">
          {maxLabel} max &middot; {memberLabel}
        </p>
      </div>

      <div className="border-t border-stone-100">
        {sortedEmployees.map((emp) => (
          <div
            key={emp.id}
            className="px-4 py-2 flex items-center justify-between gap-3 group hover:bg-stone-50 transition-colors duration-100"
          >
            <span className="text-sm text-stone-700 font-sans truncate">
              {emp.firstName} {emp.lastName}
            </span>
            <RatingDots rating={emp.rating} size={6} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TeamSkillsPanelProps {
  selected: EmployeeSearchResult[];
}

function TeamSkillsPanel({ selected }: TeamSkillsPanelProps) {
  const { t } = useTranslation();
  const teamSkills = useMemo(() => buildTeamSkills(selected), [selected]);

  if (selected.length === 0) return null;

  return (
    <section className="mt-10 team-panel">
      <div className="flex items-baseline gap-3 mb-5">
        <h2 className="font-display text-xl font-semibold text-stone-950 tracking-tight">
          {t('myTeam', { defaultValue: 'My Team' })}
        </h2>
        <span className="font-mono text-sm text-stone-400 tabular-nums">
          {teamSkills.length}
        </span>
      </div>

      {teamSkills.length === 0 ? (
        <p className="text-sm text-stone-500 font-sans">
          {t('noTeamSkills', { defaultValue: 'Selected employees have no skills to display.' })}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {teamSkills.map((skill, i) => (
            <TeamSkillCard key={skill.skillId} skill={skill} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

export { TeamSkillsPanel };
