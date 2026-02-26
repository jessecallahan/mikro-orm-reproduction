'use client';

import {
    useStytchB2BClient,
    useStytchMember,
    useStytchMemberSession,
    useStytchOrganization,
    useStytchIsAuthorized
} from '@stytch/nextjs/b2b';
import {useEffect, useState} from "react";
import {hasMatchingField} from "~/functions/has-matching-field";
import {Admin} from "~/app/_components/admin";
import {filterPermissionsByField} from "~/functions/filter-permissions-by-field";

export const SessionInfo = () => {
    const {session, isInitialized} = useStytchMemberSession();
    const {member} = useStytchMember();
    const {organization} = useStytchOrganization();

    const stytch = useStytchB2BClient();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        stytch.rbac.allPermissions().then((perms) => setPermissions(perms));
    }, [stytch]);

    const [showAdminList, setShowAdminList] = useState(false);
    const hasAdminAccess = hasMatchingField(permissions, 'emo.admin');
    const filteredPermissions = filterPermissionsByField(permissions, 'emo.admin');

    if (!isInitialized) {
        return <p>Loading...</p>;
    }

    return session ? (
        <div>
            <p>Name: {member.name}</p>
            <p>Email: {member.email_address}</p>
            <p>Organization: {organization.organization_name}</p>
            <p>Roles: {member.roles.map(r => r.role_id).join(', ')}</p>
            <br/>
            <div>{hasAdminAccess ?
                !showAdminList ?
                    <button onClick={() => setShowAdminList(true)}>Admin button</button>
                    :
                    <>
                        <Admin permissions={filteredPermissions} />
                        <button onClick={() => setShowAdminList(false)}>Close Admin list</button>
                    </>
                : null
            }</div>
            <p>
                <button>Organizations button</button>
            </p>
        </div>
    ) : (
        <p>No active session</p>
    );
};