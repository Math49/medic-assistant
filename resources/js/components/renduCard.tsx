import { type ChangeEvent } from 'react';
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
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event.target.value);
    };

    return (
        <div
            className={cn(
                'mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl shadow-slate-950/20',
                className,
            )}
        >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Rendu
            </h3>
            <textarea
                value={data}
                onChange={handleChange}
                readOnly={!onChange}
                placeholder="Le texte genere apparait ici..."
                rows={8}
                className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
            />
        </div>
    );
}
