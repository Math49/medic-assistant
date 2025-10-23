import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import DateCard from '@/components/dateCard';
import FixedCard from '@/components/fixedCard';
import FormCard from '@/components/formCard';
import RenduCard from '@/components/renduCard';

type InjuryField = {
    category: string;
    type: 'radio' | 'checkbox' | 'number';
    forms?: string[];
    text: string;
};

type Injury = {
    id: string;
    title: string;
    body: InjuryField[];
    classname?: string;
};

type InjuryFormState = {
    key: string;
    injury: Injury;
    text: string;
};

const createFormKey = (injuryId: string) =>
    `${injuryId}-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

export default function Assistant({ injuries }: { injuries: Injury[] }) {
    const [location, setLocation] = useState('');
    const [hospitalText, setHospitalText] = useState('');
    const [sortieText, setSortieText] = useState('');
    const [injuryForms, setInjuryForms] = useState<InjuryFormState[]>([]);
    const [isSelectingInjury, setIsSelectingInjury] = useState(false);
    const [rendu, setRendu] = useState('');

    useEffect(() => {
        const sections = [
            hospitalText,
            ...injuryForms.map((form) => form.text).filter(Boolean),
            sortieText,
        ].filter(Boolean);

        const combined = sections.join('\n');
        setRendu((previous) => (previous === combined ? previous : combined));
    }, [hospitalText, injuryForms, sortieText]);

    const injuryOptions = useMemo(
        () =>
            injuries.map((injury) => ({
                id: injury.id,
                title: injury.title,
                injury,
            })),
        [injuries],
    );

    const handleSelectInjury = (injuryId: string) => {
        const target = injuryOptions.find((option) => option.id === injuryId);
        if (!target) {
            return;
        }

        setInjuryForms((previous) => [
            ...previous,
            {
                key: createFormKey(target.id),
                injury: target.injury,
                text: '',
            },
        ]);
    };

    const handleInjuryChange = (key: string, value: string) => {
        setInjuryForms((previous) =>
            previous.map((form) =>
                form.key === key ? { ...form, text: value } : form,
            ),
        );
    };

    const handleInjuryRemove = (key: string) => {
        setInjuryForms((previous) => previous.filter((form) => form.key !== key));
    };

    return (
        <>
            <Head title="Assistant">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen items-center gap-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100">
                <div className="h-screen w-3/4 space-y-6 overflow-y-auto pr-3">
                    <div className="flex w-full flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex cursor-pointer items-center rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-200 shadow shadow-slate-950/40 transition hover:bg-slate-950"
                        >
                            Reset
                        </button>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            placeholder="Rue, avenue..."
                            className="flex-1 min-w-[220px] rounded-xl border border-slate-800/80 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 shadow shadow-slate-950/40 placeholder:text-slate-500"
                        />
                    </div>

                    <FixedCard
                        onHospitalChange={setHospitalText}
                        onSortieChange={setSortieText}
                    />

                    <div className="space-y-4">
                        {injuryForms.map((form) => (
                            <FormCard
                                key={form.key}
                                injury={form.injury}
                                onChange={(value) =>
                                    handleInjuryChange(form.key, value)
                                }
                                onRemove={() => handleInjuryRemove(form.key)}
                            />
                        ))}

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsSelectingInjury((previous) => !previous)
                                }
                                className="inline-flex items-center rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-200 shadow shadow-slate-950/30 transition hover:bg-slate-950"
                            >
                                + Ajouter une blessure
                            </button>

                            {isSelectingInjury && (
                                <select
                                    defaultValue=""
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        if (!value) {
                                            return;
                                        }
                                        handleSelectInjury(value);
                                        event.target.value = '';
                                        setIsSelectingInjury(false);
                                    }}
                                    className="min-w-[240px] rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 shadow shadow-slate-950/30"
                                >
                                    <option value="" disabled>
                                        Choisir une blessure
                                    </option>
                                    {injuryOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-screen w-1/4 space-y-6 overflow-y-auto pl-1">
                    <DateCard />
                    <RenduCard data={rendu} onChange={setRendu} />
                </div>
            </div>
        </>
    );
}
