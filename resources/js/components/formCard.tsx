import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type InjuryField = {
    category: string;
    type: 'radio' | 'checkbox' | 'number';
    forms?: string[];
    text: string;
    classname?: string;
};

type Injury = {
    id: string;
    title: string;
    body: InjuryField[];
    classname?: string;
};

type FormCardProps = {
    injury: Injury;
    classname?: string;
    onChange?: (value: string) => void;
    onRemove?: () => void;
};

type AnswerValue = string | string[];
type AnswerMap = Record<string, AnswerValue>;

const normalizeToken = (value: string) =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '');

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

const buildInitialAnswers = (injury: Injury): AnswerMap =>
    injury.body.reduce<AnswerMap>((acc, field) => {
        const key = normalizeToken(field.category);
        acc[key] = field.type === 'checkbox' ? [] : '';
        return acc;
    }, {});

const computeSegment = (
    field: InjuryField,
    answers: AnswerMap,
): string => {
    let segment = field.text ?? '';
    const placeholders = Array.from(segment.matchAll(/\{([^}]+)\}/g));

    for (const [, rawToken] of placeholders) {
        const key = normalizeToken(rawToken);
        const answer = answers[key];

        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            return '';
        }

        const value = Array.isArray(answer) ? formatList(answer) : answer;
        const placeholder = `{${rawToken}}`;
        segment = segment.split(placeholder).join(value);
    }

    return segment;
};

const computeInjuryText = (injury: Injury, answers: AnswerMap) =>
    injury.body
        .map((field) => computeSegment(field, answers))
        .filter(Boolean)
        .join('');

export default function FormCard({
    injury,
    classname,
    onChange,
    onRemove,
}: FormCardProps) {
    const [answers, setAnswers] = useState<AnswerMap>(() =>
        buildInitialAnswers(injury),
    );
    const [text, setText] = useState('');
    const [dirty, setDirty] = useState(false);

    const autoText = useMemo(
        () => computeInjuryText(injury, answers),
        [injury, answers],
    );

    useEffect(() => {
        if (!dirty) {
            setText(autoText);
        }
    }, [autoText, dirty]);

    useEffect(() => {
        onChange?.(text);
    }, [text, onChange]);

    const updateAnswer = useCallback(
        (key: string, value: AnswerValue) => {
            setAnswers((prev) => ({
                ...prev,
                [key]: value,
            }));
            setDirty(false);
        },
        [],
    );

    const handleCheckboxToggle = useCallback(
        (key: string, option: string) => {
            setAnswers((prev) => {
                const current = prev[key];
                const next = Array.isArray(current) ? [...current] : [];

                const index = next.indexOf(option);
                if (index >= 0) {
                    next.splice(index, 1);
                } else {
                    next.push(option);
                }

                return { ...prev, [key]: next };
            });
            setDirty(false);
        },
        [],
    );

    const handleNumberChange = useCallback(
        (key: string, value: string) => {
            updateAnswer(key, value);
        },
        [updateAnswer],
    );

    const renderField = (field: InjuryField) => {
        const answerKey = normalizeToken(field.category);
        const answer = answers[answerKey];

        if (field.type === 'radio') {
            return (
                <div className={`space-y-2 ${field.classname}`}>
                    {field.forms?.map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-3 h-full rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm shadow shadow-slate-950/30 transition hover:bg-slate-800"
                        >
                            <input
                                type="radio"
                                name={`${injury.id}-${answerKey}`}
                                value={option}
                                checked={answer === option}
                                onChange={(event) =>
                                    updateAnswer(answerKey, event.target.value)
                                }
                                className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-slate-100">{option}</span>
                        </label>
                    ))}
                </div>
            );
        }

        if (field.type === 'checkbox') {
            const selected = Array.isArray(answer) ? answer : [];
            return (
                <div className={`space-y-2 ${field.classname}`}>
                    {field.forms?.map((option) => (
                        <label
                            key={option}
                            className="flex items-center h-full gap-3 rounded-2xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm shadow shadow-slate-950/30 transition hover:bg-slate-800"
                        >
                            <input
                                type="checkbox"
                                value={option}
                                checked={selected.includes(option)}
                                onChange={() =>
                                    handleCheckboxToggle(answerKey, option)
                                }
                                className="h-4 w-4 border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-slate-100">{option}</span>
                        </label>
                    ))}
                </div>
            );
        }

        return (
            <div className={`space-y-2 ${field.classname}`}>
                <input
                    type="number"
                    inputMode="numeric"
                    value={typeof answer === 'string' ? answer : ''}
                    onChange={(event) =>
                        handleNumberChange(answerKey, event.target.value)
                    }
                    className="w-full rounded-2xl border h-full border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 shadow shadow-slate-950/30 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
                    placeholder="Saisir une valeur"
                />
            </div>
        );
    };

    return (
        <div
            className={cn(
                'w-full rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl shadow-slate-950/20',
                classname,
            )}
        >
            <header className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                        {injury.title}
                    </h3>
                </div>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="inline-flex items-center rounded-lg border border-red-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-300 transition hover:border-red-500 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                        Retirer
                    </button>
                )}
            </header>

            <div className={`space-y-6 ${injury.classname}`}>
                {injury.body.map((field) => (
                    <div key={field.category} className="space-y-3">
                        <h4 className="text-sm font-semibold text-slate-200">
                            {field.category}
                        </h4>
                        {renderField(field)}
                    </div>
                ))}
            </div>

            <textarea
                value={text}
                onChange={(event) => {
                    setDirty(true);
                    setText(event.target.value);
                }}
                placeholder="Texte genere pour cette blessure"
                rows={4}
                className="mt-6 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 shadow-inner shadow-slate-950/40 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-0"
            />
        </div>
    );
}
