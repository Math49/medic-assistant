import { Head } from '@inertiajs/react';

export default function Assistant({ injuries }: { injuries: any[] }) {

    console.log(injuries);

    return (
        <>
            <Head title="Assistant">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center">
                <h1 className=''>Assistant</h1>
            </div>
        </>
    );
}
