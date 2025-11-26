'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ORDER_STATUS, type OrderStatus } from '@/constants/order';
import {
  Clock,
  CalendarCheck,
  CookingPot,
  PackageCheck,
  Utensils,
  XCircle,
} from 'lucide-react';

interface Step {
  key: OrderStatus;
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
}

const STEP_CONFIG: Step[] = [
  { key: ORDER_STATUS.PENDING, Icon: Clock },
  {
    key: ORDER_STATUS.CONFIRMED,
    Icon: CalendarCheck,
  },
  {
    key: ORDER_STATUS.PREPARING,
    Icon: CookingPot,
  },
  { key: ORDER_STATUS.READY, Icon: PackageCheck },
  { key: ORDER_STATUS.SERVED, Icon: Utensils },
];

type Props = {
  status: OrderStatus;
  className?: string;
};

export function OrderStatusStepper({ status, className }: Props) {
  const t = useTranslations();
  const isCancelled = status === ORDER_STATUS.CANCELLED;
  const currentIndex = isCancelled
    ? Math.min(
        STEP_CONFIG.findIndex((s) => s.key === ORDER_STATUS.PREPARING),
        STEP_CONFIG.length - 1,
      )
    : Math.max(
        STEP_CONFIG.findIndex((s) => s.key === status),
        0,
      );

  // Mobile: Show compact horizontal view with relevant steps
  const getMobileSteps = (): Array<
    | { type: 'step'; step: Step; showLabel: boolean }
    | { type: 'ellipsis' }
    | { type: 'cancelled' }
  > => {
    if (isCancelled) {
      return [
        { type: 'step', step: STEP_CONFIG[currentIndex], showLabel: true },
        { type: 'cancelled' },
      ];
    }

    const steps: Array<
      { type: 'step'; step: Step; showLabel: boolean } | { type: 'ellipsis' }
    > = [];

    // Show first step if current is not first
    if (currentIndex > 0) {
      steps.push({ type: 'step', step: STEP_CONFIG[0], showLabel: true });
    }

    // Show ellipsis if we skipped steps
    if (currentIndex > 1) {
      steps.push({ type: 'ellipsis' });
    }

    // Always show current step with label
    steps.push({
      type: 'step',
      step: STEP_CONFIG[currentIndex],
      showLabel: true,
    });

    // Show last step if current is not last
    if (currentIndex < STEP_CONFIG.length - 1) {
      // Check if next step is the last step (consecutive)
      const isNextStepLast = currentIndex === STEP_CONFIG.length - 2;

      if (!isNextStepLast) {
        // Show ellipsis only if there are steps between current and last
        steps.push({ type: 'ellipsis' });
      }

      steps.push({
        type: 'step',
        step: STEP_CONFIG[STEP_CONFIG.length - 1],
        showLabel: true,
      });
    }

    return steps;
  };

  const mobileSteps = getMobileSteps();

  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-center',
        className,
      )}
    >
      {/* Mobile: Compact Horizontal Layout */}
      <div className="flex items-center gap-2 md:hidden">
        {mobileSteps.map((item, idx) => {
          if (item.type === 'cancelled') {
            return (
              <div key="cancelled" className="flex items-center gap-2">
                <div className="bg-destructive/40 h-px w-6" />
                <div className="flex flex-col items-center gap-1">
                  <div className="border-destructive/30 bg-destructive/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
                    <XCircle className="text-destructive size-4" />
                  </div>
                  <span className="text-destructive text-[11px] leading-none font-medium">
                    {t('Common.order.cancelled')}
                  </span>
                </div>
              </div>
            );
          }

          if (item.type === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="text-muted-foreground flex w-6 items-center justify-center text-xs"
              >
                •••
              </span>
            );
          }

          // item.type === "step"
          const step = item.step;
          const stepIndex = STEP_CONFIG.findIndex((s) => s.key === step.key);
          const isDone = stepIndex < currentIndex && !isCancelled;
          const isCurrent = stepIndex === currentIndex && !isCancelled;

          const colorClasses = isCancelled
            ? 'text-destructive'
            : isDone
              ? 'text-foreground'
              : isCurrent
                ? 'text-primary'
                : 'text-muted-foreground';

          // Determine connector color based on the previous step
          const getPrevStepIndex = () => {
            if (idx > 0 && mobileSteps[idx - 1]?.type === 'step') {
              const prevItem = mobileSteps[idx - 1];
              if (prevItem.type === 'step') {
                return STEP_CONFIG.findIndex(
                  (s) => s.key === prevItem.step.key,
                );
              }
            }
            return -1;
          };
          const prevStepIndex = getPrevStepIndex();
          const connectorIsDone =
            prevStepIndex >= 0 && prevStepIndex < currentIndex && !isCancelled;

          return (
            <div key={step.key} className="flex items-center gap-2">
              {idx > 0 &&
                item.type === 'step' &&
                mobileSteps[idx - 1]?.type === 'step' && (
                  <div
                    className={cn(
                      'h-px w-6',
                      isCancelled
                        ? 'bg-destructive/40'
                        : connectorIsDone
                          ? 'bg-foreground/40'
                          : 'bg-muted',
                    )}
                  />
                )}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border',
                    isCancelled
                      ? 'border-destructive/30 bg-destructive/10'
                      : isDone
                        ? 'border-foreground/20 bg-foreground/10'
                        : isCurrent
                          ? 'border-primary/30 bg-primary/10'
                          : 'border-muted bg-muted/40',
                  )}
                  aria-current={isCurrent || undefined}
                >
                  <step.Icon className={cn('size-4', colorClasses)} />
                </div>
                {item.showLabel && (
                  <span
                    className={cn(
                      'text-[11px] leading-none whitespace-nowrap',
                      isCancelled
                        ? 'text-destructive'
                        : isDone
                          ? 'text-foreground'
                          : isCurrent
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground',
                    )}
                  >
                    {t(`Common.order.${step.key}`)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden items-center gap-2 md:flex">
        {STEP_CONFIG.map((step, idx) => {
          const isDone = idx < currentIndex && !isCancelled;
          const isCurrent = idx === currentIndex && !isCancelled;

          const colorClasses = isCancelled
            ? 'text-destructive'
            : isDone
              ? 'text-foreground'
              : isCurrent
                ? 'text-primary'
                : 'text-muted-foreground';

          const Connector = () => (
            <div
              className={cn(
                'h-px w-8 shrink-0',
                isCancelled
                  ? 'bg-destructive/40'
                  : isDone
                    ? 'bg-foreground/40'
                    : 'bg-muted',
              )}
            />
          );

          return (
            <div key={step.key} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border',
                    isCancelled
                      ? 'border-destructive/30 bg-destructive/10'
                      : isDone
                        ? 'border-foreground/20 bg-foreground/10'
                        : isCurrent
                          ? 'border-primary/30 bg-primary/10'
                          : 'border-muted bg-muted/40',
                  )}
                  aria-current={isCurrent || undefined}
                >
                  <step.Icon className={cn('size-4', colorClasses)} />
                </div>
                <span
                  className={cn(
                    'text-xs whitespace-nowrap',
                    isCancelled
                      ? 'text-destructive'
                      : isDone
                        ? 'text-foreground'
                        : isCurrent
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground',
                  )}
                >
                  {t(`Common.order.${step.key}`)}
                </span>
              </div>
              {idx < STEP_CONFIG.length - 1 && <Connector />}
            </div>
          );
        })}

        {isCancelled && (
          <>
            <div className="bg-destructive/40 h-px w-8 shrink-0" />
            <div className="flex flex-col items-center gap-1">
              <div className="border-destructive/30 bg-destructive/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
                <XCircle className="text-destructive size-4" />
              </div>
              <span className="text-destructive text-xs font-medium whitespace-nowrap">
                Cancelled
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
