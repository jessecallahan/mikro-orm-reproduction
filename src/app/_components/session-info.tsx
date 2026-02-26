'use client';

import { useStytchMemberSession } from '@stytch/nextjs/b2b';

export const SessionInfo = () => {
    const { session, isInitialized } = useStytchMemberSession();

    console.log('session isInitialized', session);
    if (!isInitialized) {
        return <p>Loading...</p>;
    }

    return session ? (
        <div>
            <p>Session ID: {session.member_session_id}</p>
            <p>Expires: {new Date(session.expires_at).toLocaleString()}</p>
        </div>
    ) : (
        <p>No active session</p>
    );
};