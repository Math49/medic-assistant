import { cn } from '@/lib/utils';

type RenduCardProps = {
    data?: string;
    className?: string;
};

export default function RenduCard({
    data = '',
    className,
}: RenduCardProps) {
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
                readOnly
                placeholder="Le texte genere apparait ici..."
                rows={8}
                className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500"
            />
        </div>
    );
}
