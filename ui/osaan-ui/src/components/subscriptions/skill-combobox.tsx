'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSkills } from '@/hooks/use-skills';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/cn';

interface SkillComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function SkillCombobox({
  value,
  onChange,
  placeholder,
  id,
  className,
}: SkillComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debouncedQuery = useDebounce(value, 180);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useSkills({
    query: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
    size: 8,
  });

  const suggestions = useMemo(() => {
    const list = data?.skills ?? [];
    if (!value.trim()) return list.slice(0, 8);
    const lower = value.trim().toLowerCase();
    return list.filter((s) => s.name.toLowerCase().includes(lower)).slice(0, 8);
  }, [data, value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const select = (name: string) => {
    onChange(name);
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && activeIdx >= 0) {
      e.preventDefault();
      select(suggestions[activeIdx].name);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <div className="relative flex items-center">
        <span className="absolute left-0 font-display text-saffron-600 text-xl select-none pointer-events-none">
          ›
        </span>
        <input
          id={id}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder ?? t('skillComboPlaceholder', { defaultValue: 'Type a skill name…' })}
          className={cn(
            'w-full bg-transparent pl-7 pr-2 py-2',
            'font-display text-2xl sm:text-3xl text-stone-950 placeholder:text-stone-300',
            'border-0 border-b border-stone-300 focus:border-saffron-600',
            'outline-none transition-colors duration-150',
            'tracking-tight'
          )}
        />
        {isFetching && (
          <span className="absolute right-0 text-stone-400 text-xs font-mono uppercase tracking-widest">
            …
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className={cn(
            'absolute z-30 left-0 right-0 top-full mt-1.5',
            'bg-white border border-stone-200 rounded-md shadow-lg shadow-stone-950/[0.04]',
            'overflow-hidden max-h-72 overflow-y-auto'
          )}
        >
          <li className="px-3 pt-2 pb-1.5 text-[10px] uppercase tracking-[0.18em] text-stone-400 font-mono">
            {t('skillComboHeading', { defaultValue: 'Skill registry' })}
          </li>
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={activeIdx === i}>
              <button
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => select(s.name)}
                className={cn(
                  'w-full text-left px-3 py-2 flex items-baseline gap-3',
                  'font-sans text-sm text-stone-800 transition-colors duration-100',
                  activeIdx === i ? 'bg-saffron-50' : 'hover:bg-stone-50'
                )}
              >
                <span className="font-mono text-[10px] text-stone-400 tabular-nums w-5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-base text-stone-950 leading-tight">
                  {s.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
