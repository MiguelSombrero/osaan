'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import { RatingInput } from '@/components/ui/rating-input';
import { Button } from '@/components/ui/button';
import {
  subscriptionDraftSchema,
  type SubscriptionDraftInferred,
} from '@/lib/validation/schemas/subscription.schema';
import { getFieldErrorMessage } from '@/lib/validation/i18n-error-map';
import { SkillCombobox } from './skill-combobox';

interface SubscriptionComposerProps {
  recipientEmail?: string;
  onCreate: (draft: SubscriptionDraftInferred) => void;
  submitting?: boolean;
}

export function SubscriptionComposer({
  recipientEmail,
  onCreate,
  submitting = false,
}: SubscriptionComposerProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SubscriptionDraftInferred>({
    resolver: zodResolver(subscriptionDraftSchema),
    mode: 'onChange',
    defaultValues: { skill: '', rating: undefined },
  });

  const onSubmit = (data: SubscriptionDraftInferred) => {
    onCreate(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
        {/* Step 01 — Skill */}
        <ComposerStep
          number="01"
          lead={t('composerStep2', {
            defaultValue: 'When someone adds the skill',
          })}
        >
          <Controller
            name="skill"
            control={control}
            render={({ field }) => (
              <>
                <SkillCombobox value={field.value} onChange={field.onChange} />
                {errors.skill && (
                  <p className="text-xs text-error font-sans mt-1">
                    {getFieldErrorMessage('skill', errors.skill, t)}
                  </p>
                )}
              </>
            )}
          />
        </ComposerStep>

        {/* Step 02 — Rating */}
        <ComposerStep
          number="02"
          lead={t('composerStep3', {
            defaultValue: 'at a minimum proficiency of',
          })}
        >
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <>
                <div className="flex items-center gap-4">
                  <RatingInput value={field.value ?? null} onChange={field.onChange} size="md" />
                  {field.value != null && (
                    <span className="font-display text-stone-500 text-sm italic">
                      {t('composerOrHigher', { defaultValue: 'or higher' })}
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p className="text-xs text-error font-sans mt-1">
                    {getFieldErrorMessage('rating', errors.rating, t)}
                  </p>
                )}
              </>
            )}
          />
        </ComposerStep>
      </div>

      {/* Submit */}
      <div className="relative mt-10 flex items-center gap-4 pt-6 border-t border-stone-200">
        <Button type="submit" variant="primary" size="lg" disabled={!isValid || submitting}>
          {t('composerSubmit', { defaultValue: 'Open the watch' })}
        </Button>
        <p className="text-xs text-stone-500 font-sans italic max-w-xs leading-relaxed">
          {recipientEmail
            ? t('composerHintToEmail', {
                defaultValue:
                  'Dispatches will be sent to {{email}} the moment a matching profile is published.',
                email: recipientEmail,
              })
            : t('composerHint', {
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
