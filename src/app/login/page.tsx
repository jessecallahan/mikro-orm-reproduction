'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStytchMemberSession } from '@stytch/nextjs/b2b';
import {LoginOrSignupDiscoveryForm} from "~/app/_components/login-or-signup-discovery-form";

export default function Login() {
    const { session, isInitialized } = useStytchMemberSession();
    const router = useRouter();

    // Route users to your app once they have fully authenticated (either immediately or upon completing the remainder of the auth flow, like MFA)
    useEffect(() => {
        if (session && isInitialized) {
            router.replace("/");
        }
    }, [session, isInitialized, router]);

    if (!isInitialized || session) {
        return <p>Loading...</p>;
    }

    return <LoginOrSignupDiscoveryForm/>;
}