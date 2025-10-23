import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const HOSPITAL_OPTIONS = ['hopital sud', 'paleto'];
const CHAMBRE_OPTIONS = ['salle de reveil WARD', "chambre d'hospitalisation"];
const PAPIER_OPTIONS = ["l'ordonnance", "l'arret de travail"];
const DEPART_OPTIONS = ['Depart du Centre Hospitalier', 'Hospitalisation'];

type FixedCardProps = {
    className?: string;
    onChange?: (value: string) => void;
};

const formatList = (items: string[]) => {
    if (items.length <= 1) {
        return items[0] ?? '';
    }
    const start = items.slice(0, -1).join(', ');
    const last = items[items.length - 1];
    return `${start} et ${last}`;
};

export default function FixedCard({ className, onChange }: FixedCardProps) {
    const [hospitalChoice, setHospitalChoice] = useState('');
    const [hospitalText, setHospitalText] = useState('');
    const [chambreSelections, setChambreSelections] = useState<string[]>([]);
    const [papierSelections, setPapierSelections] = useState<string[]>([]);
    const [departChoice, setDepartChoice] = useState('');
    const [sortieText, setSortieText] = useState('');

    const toggleSelection = useCallback((value: string, current: string[]) => {
        return current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value];
    }, []);

    useEffect(() => {
        if (!hospitalChoice) {
            setHospitalText('');
            return;
        }
        setHospitalText(`Emmené à ${hospitalChoice}`);
    }, [hospitalChoice]);

    const generatedSortieText = useMemo(() => {
        const parts: string[] = [];

        if (chambreSelections.length > 0) {
            parts.push(`Déplacement du patient dans ${formatList(chambreSelections)}\n`);
        }

        if (papierSelections.length > 0) {
            parts.push(`Transmission de ${formatList(papierSelections)}\n`);
        }

        if (departChoice) {
            parts.push(`${departChoice} du patient`);
        }

        return parts.join('');
    }, [chambreSelections, papierSelections, departChoice]);

    useEffect(() => {
        setSortieText(generatedSortieText);
    }, [generatedSortieText]);

    useEffect(() => {
        if (!onChange) {
            return;
        }
        const segments = [hospitalText, sortieText].filter(Boolean);
        onChange(segments.join('\n').trim());
    }, [hospitalText, sortieText, onChange]);

    return (
        <div
            className={cn(
                'w-full flex gap-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl shadow-slate-950/20',
                className,
            )}
        >
            <section className='w-1/3'>
                <header className="mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Hopital
                    </h3>
                </header>

                <div className="space-y-3">
                    
                    {HOSPITAL_OPTIONS.map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm shadow shadow-slate-950/30 transition hover:bg-slate-800"
                        >
                            <input
                                type="radio"
                                name="fixed-hospital"
                                value={option}
                                checked={hospitalChoice === option}
                                onChange={(event) => setHospitalChoice(event.target.value)}
                                className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-slate-100">{option}</span>
                        </label>
                    ))}
                </div>

                <textarea
                    value={hospitalText}
                    onChange={(event) => setHospitalText(event.target.value)}
                    placeholder="Texte genere pour la section hopital"
                    className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
                    rows={1}
                />
            </section>

            <section className="w-2/3">
                <header className="mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Sortie
                    </h3>
                </header>

                <div className="space-y-6 flex justify-between">
                    <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Chambre
                        </h4>
                        <div className="space-y-2">
                            {CHAMBRE_OPTIONS.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm shadow shadow-slate-950/30 transition hover:bg-slate-800"
                                >
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={chambreSelections.includes(option)}
                                        onChange={() =>
                                            setChambreSelections((current) =>
                                                toggleSelection(option, current),
                                            )
                                        }
                                        className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-100">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Papiers
                        </h4>
                        <div className="space-y-2">
                            {PAPIER_OPTIONS.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm shadow shadow-slate-950/30 transition hover:bg-slate-800"
                                >
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={papierSelections.includes(option)}
                                        onChange={() =>
                                            setPapierSelections((current) =>
                                                toggleSelection(option, current),
                                            )
                                        }
                                        className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-100">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Depart
                        </h4>
                        <div className="space-y-2">
                            {DEPART_OPTIONS.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm shadow shadow-slate-950/30 transition hover:bg-slate-800"
                                >
                                    <input
                                        type="radio"
                                        name="fixed-depart"
                                        value={option}
                                        checked={departChoice === option}
                                        onChange={(event) => setDepartChoice(event.target.value)}
                                        className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-100">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <textarea
                    value={sortieText}
                    onChange={(event) => setSortieText(event.target.value)}
                    placeholder="Texte genere pour la section sortie"
                    className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
                    rows={3}
                />
            </section>
        </div>
    );
}
