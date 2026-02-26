'use client';

import { createStytchB2BClient, StytchB2BProvider } from '@stytch/nextjs/b2b';

const stytchClient = createStytchB2BClient(
    process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN
);

export default function Stytch({ children }: { children: React.ReactNode }) {
    return <StytchB2BProvider stytch={stytchClient}>{children}</StytchB2BProvider>;
}