import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import DateCard from '@/components/dateCard';
import RenduCard from '@/components/renduCard';

export default function Assistant({ injuries }: { injuries: any[] }) {
    const [rendu, setRendu] = useState();

    console.log(injuries);

    return (
        <>
            <Head title="Assistant">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen items-center">
                <div className='w-3/4 h-screen bg-amber-200'>
                </div>
                <div className='w-1/4 h-screen bg-red-200'>

                    <DateCard />
                    <RenduCard data={rendu} />
                </div>
            </div>
        </>
    );
}
