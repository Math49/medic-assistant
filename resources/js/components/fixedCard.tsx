import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const HOSPITAL_OPTIONS = ['hôpital sud', 'paleto'];
const CHAMBRE_OPTIONS = ['salle de réveil WARD', "chambre d'hospitalisation"];
const PAPIER_OPTIONS = ["l'ordonnance", "l'arrêt de travail"];
const DEPART_OPTIONS = ['Départ du Centre Hospitalier', 'Hospitalisation'];

type FixedCardProps = {
    className?: string;
    onHospitalChange?: (value: string) => void;
    onSortieChange?: (value: string) => void;
};

const formatList = (items: string[]) => {
    if (items.length === 0) {
        return '';
    }
    if (items.length === 1) {
        return items[0];
    }
    const start = items.slice(0, -1).join(', ');
    const last = items[items.length - 1];
    return `${start} et ${last}`;
};

export default function FixedCard({
    className,
    onHospitalChange,
    onSortieChange,
}: FixedCardProps) {
    const [hospitalChoice, setHospitalChoice] = useState('');
    const [hospitalText, setHospitalText] = useState('');
    const [hospitalDirty, setHospitalDirty] = useState(false);

    const [chambreSelections, setChambreSelections] = useState<string[]>([]);
    const [papierSelections, setPapierSelections] = useState<string[]>([]);
    const [departChoice, setDepartChoice] = useState('');
    const [sortieText, setSortieText] = useState('');
    const [sortieDirty, setSortieDirty] = useState(false);

    const toggleSelection = useCallback((value: string, list: string[]) => {
        return list.includes(value)
            ? list.filter((item) => item !== value)
            : [...list, value];
    }, []);

    useEffect(() => {
        if (hospitalDirty) {
            return;
        }
        if (!hospitalChoice) {
            setHospitalText('');
            return;
        }
        setHospitalText(`Emmené à ${hospitalChoice}`);
    }, [hospitalChoice, hospitalDirty]);

    const generatedSortieText = useMemo(() => {
        const parts: string[] = [];

        if (chambreSelections.length > 0) {
            parts.push(`Déplacement du patient dans ${formatList(chambreSelections)} \n`);
        }

        if (papierSelections.length > 0) {
            parts.push(`Transmission de ${formatList(papierSelections)} \n`);
        }

        if (departChoice) {
            parts.push(`${departChoice} du patient`);
        }

        return parts.join('');
    }, [chambreSelections, papierSelections, departChoice]);

    useEffect(() => {
        if (sortieDirty) {
            return;
        }
        setSortieText(generatedSortieText);
    }, [generatedSortieText, sortieDirty]);

    useEffect(() => {
        onHospitalChange?.(hospitalText);
    }, [hospitalText, onHospitalChange]);

    useEffect(() => {
        onSortieChange?.(sortieText);
    }, [sortieText, onSortieChange]);

    return (
        <div
            className={cn(
                'w-full rounded-3xl flex border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl shadow-slate-950/20',
                className,
            )}
        >
            <section className="w-1/3 pr-4">
                <header className="mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Hôpital
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
                                onChange={(event) => {
                                    setHospitalDirty(false);
                                    setHospitalChoice(event.target.value);
                                }}
                                className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-slate-100">{option}</span>
                        </label>
                    ))}
                </div>

                <textarea
                    value={hospitalText}
                    onChange={(event) => {
                        setHospitalDirty(true);
                        setHospitalText(event.target.value);
                    }}
                    placeholder="Texte genere pour la section hopital"
                    className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
                    rows={3}
                />
            </section>

            <section className="w-2/3 pl-4 border-l border-slate-800">
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
                                        onChange={() => {
                                            setSortieDirty(false);
                                            setChambreSelections((current) =>
                                                toggleSelection(option, current),
                                            );
                                        }}
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
                                        onChange={() => {
                                            setSortieDirty(false);
                                            setPapierSelections((current) =>
                                                toggleSelection(option, current),
                                            );
                                        }}
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
                                        onChange={(event) => {
                                            setSortieDirty(false);
                                            setDepartChoice(event.target.value);
                                        }}
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
                    onChange={(event) => {
                        setSortieDirty(true);
                        setSortieText(event.target.value);
                    }}
                    placeholder="Texte genere pour la section sortie"
                    className="mt-4 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
                    rows={4}
                />
            </section>
        </div>
    );
}
