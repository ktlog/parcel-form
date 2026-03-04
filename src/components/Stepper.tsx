type Props = {
    step: 1 | 2 | 3;
};

const steps = [
    { n: 1, label: 'Отправитель' },
    { n: 2, label: 'Получатель и посылка' },
    { n: 3, label: 'Подтверждение' },
] as const;

export function Stepper({ step }: Props) {
    const segmentByStep: Record<Props['step'], { left: number; width: number }> = {
        1: { left: 0, width: 100 / 3 },
        2: { left: 33, width: 34 },
        3: { left: 100 - 100 / 3, width: 100 / 3 },
    };

    const activeSegment = segmentByStep[step];

    return (
        <div className="w-full">
            <div className="mb-3 flex items-center justify-between text-sm">
                {steps.map((s) => {
                    const isActive = s.n === step;
                    const isDone = s.n < step;

                    const circleClass = isActive
                        ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                        : isDone
                            ? 'bg-zinc-700 text-zinc-100 dark:bg-zinc-300 dark:text-zinc-900'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200';

                    return (
                        <div key={s.n} className="flex items-center gap-2">
                            <div
                                className={[
                                    'grid h-7 w-7 place-items-center rounded-full font-semibold',
                                    circleClass,
                                ].join(' ')}
                            >
                                {s.n}
                            </div>
                            <span
                                className={
                                    isActive
                                        ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                                        : 'text-zinc-600 dark:text-zinc-400'
                                }
                            >
                {s.label}
              </span>
                        </div>
                    );
                })}
            </div>

            <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                    className="absolute top-0 h-2 rounded-full bg-zinc-900 transition-[left,width] duration-300 dark:bg-zinc-100"
                    style={{ left: `${activeSegment.left}%`, width: `${activeSegment.width}%` }}
                />
            </div>
        </div>
    );
}
