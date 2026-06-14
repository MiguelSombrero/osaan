'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { RatingInput } from '@/components/ui/rating-input';
import { Button } from '@/components/ui/button';
import type { Rating } from '@/types/rating';
import type { SubscriptionDraft } from '@/types/subscription';
import { SkillCombobox } from './skill-combobox';

interface SubscriptionComposerProps {
  defaultEmail?: string;
  onCreate: (draft: SubscriptionDraft) => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SubscriptionComposer({
  defaultEmail = '',
  onCreate,
}: SubscriptionComposerProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState(defaultEmail);
  const [skill, setSkill] = useState('');
  const [rating, setRating] = useState<Rating | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailOk = isValidEmail(email);
  const skillOk = skill.trim().length > 0;
  const ratingOk = rating !== null;
  const canSubmit = emailOk && skillOk && ratingOk;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || rating === null) return;
    onCreate({ email: email.trim(), skill: skill.trim(), rating });
    setSkill('');
    setRating(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'relative bg-white rounded-md border border-stone-200',
        'p-6 sm:p-10',
        'overflow-hidden'
      )}
    >
      {/* Decorative background — torn-newsprint gradient */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.55]"
        style={{
          background:
            'radial-gradient(circle at 90% -10%, rgba(196,122,30,0.10), transparent 38%), radial-gradient(circle at -10% 110%, rgba(196,122,30,0.06), transparent 42%)',
        }}
      />

      {/* Header rule */}
      <div className="relative flex items-center gap-3 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-saffron-700">
          {t('composerSection', { defaultValue: 'Compose a watch' })}
        </span>
        <span className="flex-1 h-px bg-stone-200" />
        <span className="font-mono text-[10px] text-stone-400 tabular-nums">
          {new Date().toISOString().slice(0, 10)}
        </span>
      </div>

      <div className="relative space-y-7 sm:space-y-9">
        {/* Step 01 — Email */}
        <ComposerStep
          number="01"
          lead={t('composerStep1', {
            defaultValue: 'Send the dispatch to',
          })}
        >
          <div className="relative flex items-center">
            <span className="absolute left-0 font-display text-saffron-600 text-xl select-none pointer-events-none">
              ›
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder={t('composerEmailPlaceholder', {
                defaultValue: 'recipient@example.com',
              })}
              className={cn(
                'w-full bg-transparent pl-7 pr-2 py-2',
                'font-mono text-base sm:text-lg text-stone-950 placeholder:text-stone-300',
                'border-0 border-b border-stone-300 focus:border-saffron-600',
                'outline-none transition-colors duration-150',
                emailTouched && !emailOk && 'border-error focus:border-error'
              )}
            />
          </div>
          {emailTouched && !emailOk && email.length > 0 && (
            <p className="mt-2 text-xs text-error font-sans">
              {t('composerEmailInvalid', { defaultValue: 'Enter a valid email address' })}
            </p>
          )}
        </ComposerStep>

        {/* Step 02 — Skill */}
        <ComposerStep
          number="02"
          lead={t('composerStep2', {
            defaultValue: 'When someone adds the skill',
          })}
        >
          <SkillCombobox value={skill} onChange={setSkill} />
        </ComposerStep>

        {/* Step 03 — Rating */}
        <ComposerStep
          number="03"
          lead={t('composerStep3', {
            defaultValue: 'at a minimum proficiency of',
          })}
        >
          <div className="flex items-center gap-4">
            <RatingInput value={rating} onChange={setRating} size="md" />
            {rating !== null && (
              <span className="font-display text-stone-500 text-sm italic">
                {t('composerOrHigher', { defaultValue: 'or higher' })}
              </span>
            )}
          </div>
        </ComposerStep>
      </div>

      {/* Submit */}
      <div className="relative mt-10 flex items-center gap-4 pt-6 border-t border-stone-200">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!canSubmit}
        >
          {t('composerSubmit', { defaultValue: 'Open the watch' })}
        </Button>
        <p className="text-xs text-stone-500 font-sans italic max-w-xs leading-relaxed">
          {t('composerHint', {
            defaultValue:
              'You will receive an email the moment a matching profile is published.',
          })}
        </p>
      </div>
    </form>
  );
}

function ComposerStep({
  number,
  lead,
  children,
}: {
  number: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 items-start">
      <span className="font-mono text-xs text-stone-400 tabular-nums pt-3 tracking-widest">
        {number}
      </span>
      <div>
        <p className="font-display text-stone-600 italic text-sm sm:text-base leading-snug mb-1.5">
          {lead}
        </p>
        {children}
      </div>
    </div>
  );
}
