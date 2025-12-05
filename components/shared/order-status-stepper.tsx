'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  ORDER_STATUS,
  ORDER_STEPS_CONFIG,
  type OrderStatusProps,
  type OrderStepsProps,
} from '@/constants/order';
import { XCircleIcon } from 'lucide-react';

type Props = {
  status: OrderStatusProps;
  className?: string;
};

export function OrderStatusStepper({ status, className }: Props) {
  const t = useTranslations();
  const isCancelled = status === ORDER_STATUS.CANCELLED;
  const currentIndex = isCancelled
    ? Math.min(
        ORDER_STEPS_CONFIG.findIndex((s) => s.key === ORDER_STATUS.PREPARING),
        ORDER_STEPS_CONFIG.length - 1,
      )
    : Math.max(
        ORDER_STEPS_CONFIG.findIndex((s) => s.key === status),
        0,
      );

  // Mobile: Show compact horizontal view with relevant steps
  const getMobileSteps = (): Array<
    | { type: 'step'; step: OrderStepsProps; showLabel: boolean }
    | { type: 'ellipsis' }
    | { type: 'cancelled' }
  > => {
    if (isCancelled) {
      return [
        {
          type: 'step',
          step: ORDER_STEPS_CONFIG[currentIndex],
          showLabel: true,
        },
        { type: 'cancelled' },
      ];
    }

    const steps: Array<
      | { type: 'step'; step: OrderStepsProps; showLabel: boolean }
      | { type: 'ellipsis' }
    > = [];

    // Show first step if current is not first
    if (currentIndex > 0) {
      steps.push({
        type: 'step',
        step: ORDER_STEPS_CONFIG[0],
        showLabel: true,
      });
    }

    // Show ellipsis if we skipped steps
    if (currentIndex > 1) {
      steps.push({ type: 'ellipsis' });
    }

    // Always show current step with label
    steps.push({
      type: 'step',
      step: ORDER_STEPS_CONFIG[currentIndex],
      showLabel: true,
    });

    // Show last step if current is not last
    if (currentIndex < ORDER_STEPS_CONFIG.length - 1) {
      // Check if next step is the last step (consecutive)
      const isNextStepLast = currentIndex === ORDER_STEPS_CONFIG.length - 2;

      if (!isNextStepLast) {
        // Show ellipsis only if there are steps between current and last
        steps.push({ type: 'ellipsis' });
      }

      steps.push({
        type: 'step',
        step: ORDER_STEPS_CONFIG[ORDER_STEPS_CONFIG.length - 1],
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
                <div className="flex flex-col items-center gap-1.5">
                  <div className="border-destructive/30 bg-destructive/10 flex size-10 shrink-0 items-center justify-center rounded-full border">
                    <XCircleIcon className="text-destructive size-5" />
                  </div>
                  <span className="text-destructive text-xs font-medium whitespace-nowrap">
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
          const stepIndex = ORDER_STEPS_CONFIG.findIndex(
            (s) => s.key === step.key,
          );
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
                return ORDER_STEPS_CONFIG.findIndex(
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
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full border',
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
                  <step.Icon className={cn('size-5', colorClasses)} />
                </div>
                {item.showLabel && (
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden items-center gap-2 md:flex">
        {ORDER_STEPS_CONFIG.map((step, idx) => {
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
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-full border',
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
                  <step.Icon className={cn('size-5', colorClasses)} />
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
              {idx < ORDER_STEPS_CONFIG.length - 1 && <Connector />}
            </div>
          );
        })}

        {isCancelled && (
          <>
            <div className="bg-destructive/40 h-px w-8 shrink-0" />
            <div className="flex flex-col items-center gap-1.5">
              <div className="border-destructive/30 bg-destructive/10 flex size-10 shrink-0 items-center justify-center rounded-full border">
                <XCircleIcon className="text-destructive size-5" />
              </div>
              <span className="text-destructive text-xs font-medium whitespace-nowrap">
                {t('Common.order.cancelled')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
