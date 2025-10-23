import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

const TIME_LABELS = [
    'Depart intervention',
    'Arrivee sur les lieux',
    'Transport hopital',
    'Arrivee hopital',
    'Fin intervention',
];

const formatCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}h${minutes}`;
};

export default function DateCard({ className }: { className?: string }) {
    const [values, setValues] = useState<string[]>(
        () => Array(TIME_LABELS.length).fill(''),
    );

    const handleFillNow = useCallback((index: number) => {
        setValues((previous) => {
            const next = [...previous];
            next[index] = formatCurrentTime();
            return next;
        });
    }, []);

    const handleChange = useCallback((index: number, value: string) => {
        setValues((previous) => {
            const next = [...previous];
            next[index] = value;
            return next;
        });
    }, []);

    return (
        <div
            className={cn(
                'w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl shadow-slate-950/20',
                className,
            )}
        >
            <div className="text-center">
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                    Bloc horaires
                </h2>
            </div>

            <div className="mt-6 space-y-3">
                {TIME_LABELS.map((label, index) => (
                    <div
                        key={label}
                        className="flex overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/70 shadow shadow-slate-950/30"
                    >
                        <button
                            type="button"
                            onClick={() => handleFillNow(index)}
                            className="flex-1 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:bg-slate-800 sm:text-base"
                        >
                            {label}
                        </button>
                        <input
                            type="text"
                            value={values[index]}
                            placeholder="00h00"
                            onChange={(event) =>
                                handleChange(index, event.target.value)
                            }
                            className="w-28 shrink-0 border-0 bg-slate-950 px-4 py-3 text-right text-sm font-semibold uppercase tracking-wider text-slate-100 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 sm:w-32 sm:text-base"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
