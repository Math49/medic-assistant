import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import DateCard from '@/components/dateCard';
import RenduCard from '@/components/renduCard';

export default function Assistant({ injuries }: { injuries: any[] }) {
    const [rendu, setRendu] = useState();
    const [location, setLocation] = useState('');

    console.log(injuries);

    return (
        <>
            <Head title="Assistant">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen items-center gap-5 bg-slate-900 p-5">
                <div className="h-screen w-3/4">
                    <div className="flex w-full flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex cursor-pointer items-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 shadow shadow-slate-950/40 transition hover:bg-slate-950"
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
                            className="flex-1 min-w-[220px] rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 shadow shadow-slate-950/20 placeholder:text-slate-500"
                        />
                    </div>
                </div>
                <div className="h-screen w-1/4">
                    <DateCard />
                    <RenduCard data={rendu} />
                </div>
            </div>
        </>
    );
}
