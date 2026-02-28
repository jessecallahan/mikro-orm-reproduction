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
import {Orgs} from "~/app/_components/orgs";

export const SessionInfo = () => {
    const {session, isInitialized} = useStytchMemberSession();
    const {member} = useStytchMember();
    const {organization} = useStytchOrganization();

    const stytch = useStytchB2BClient();
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        stytch.rbac.allPermissions().then((perms) => setPermissions(perms));
    }, [stytch]);

    console.log(Object.entries(permissions));
    const [showAdminList, setShowAdminList] = useState(false);
    const hasAdminAccess = hasMatchingField(permissions, 'emo.admin');
    const filteredPermissionsByAdmin = filterPermissionsByField(permissions, 'emo.admin');

    const [showOrgs, setShowOrgs] = useState(false);
    const hasOrganizationAccess = hasMatchingField(permissions, 'emo.admin.organizations');

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
                        <Admin permissions={filteredPermissionsByAdmin}/>
                        <button onClick={() => setShowAdminList(false)}>Close Admin list</button>
                    </>
                : null
            }</div>
            <button disabled={!hasOrganizationAccess} onClick={() => setShowOrgs(true)}>Organizations button
            </button>
            <div>{showOrgs ?
                <>
                    <Orgs organization={organization}/>
                    <button onClick={() => setShowOrgs(false)}>Close Orgs list</button>
                </>
                : null
            }</div>
            {/*<br />*/}
            {/*<div>*/}
            {/*    <p>Resource and Access Permissions:</p>*/}
            {/*    {Object.entries(permissions).map(([key, value]) => (*/}
            {/*        <li key={key}>*/}
            {/*            {key}: {Object.entries(value).join(', ')}*/}
            {/*        </li>*/}
            {/*    ))}*/}

            {/*</div>*/}
        </div>
    ) : (
        <p>No active session</p>
    );
};