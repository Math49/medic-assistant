import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type RenduCardProps = {
    data?: string;
    onChange?: (value: string) => void;
    className?: string;
};

export default function RenduCard({
    data = '',
    onChange,
    className,
}: RenduCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(data);
            setCopied(true);
        } catch (error) {
            console.error('Impossible de copier le rendu :', error);
        }
    }, [data]);

    useEffect(() => {
        if (!copied) {
            return;
        }
        const timer = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timer);
    }, [copied]);

    return (
        <div
            className={cn(
                'relative mt-6 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 text-slate-100 shadow-[0_25px_55px_-30px_rgba(15,23,42,0.9)] backdrop-blur',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Rendu
                </h3>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-200 shadow shadow-slate-950/30 transition hover:bg-slate-900"
                    title="Copier le rendu"
                >
                    Copier
                    <span
                        className={cn(
                            'text-blue-400 transition-opacity',
                            copied ? 'opacity-100' : 'opacity-0',
                        )}
                    >
                        OK
                    </span>
                </button>
            </div>

            <textarea
                value={data}
                onChange={(event) => onChange?.(event.target.value)}
                placeholder="Le texte genere apparait ici..."
                rows={15}
                className="mt-4 w-full rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500"
            />
        </div>
    );
}
