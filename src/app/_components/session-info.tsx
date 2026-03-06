'use client';

import {
    useStytchB2BClient,
    useStytchMember,
    useStytchMemberSession,
    useStytchOrganization,
    useStytchIsAuthorized
} from '@stytch/nextjs/b2b';
import {useEffect, useState} from "react";
import {authorizeForResourceStartingWith} from "~/functions/authorize-for-resource-starting-with";
import {Admin} from "~/app/_components/admin";
import {filterAllPermissionsStartingWith} from "~/functions/filter-all-permissions-starting-with";
import {Orgs} from "~/app/_components/orgs";

// in application the key would be action
// A Permission is [action, isAllowed]
export type Permission = {
    [key: string]: boolean;
};

// in application resource would be the first string type so (Resource | Permission)
type Permissions = [string, Permission];
export type PermissionsMapAsArray = Permissions[];

export const SessionInfo = () => {
    const {session, isInitialized} = useStytchMemberSession();
    const {member} = useStytchMember();
    const {organization} = useStytchOrganization();

    const stytch = useStytchB2BClient();
    const [permissions, setPermissions] = useState<PermissionsMapAsArray | null>(null);

    useEffect(() => {
        stytch.rbac.allPermissions().then((perms) => {
            return setPermissions(Object.entries(perms) as PermissionsMapAsArray);
        })
    }, [stytch]);

    console.log(permissions);
    // console.log('sessionInfo', session);
    // console.log('member', member);
    // console.log('organization', organization);

    const [showAdminList, setShowAdminList] = useState(false);
    const hasAdminAccess = authorizeForResourceStartingWith(permissions, 'emo.admin');
    // todo possibly take a wildcard
    const filteredPermissionsByAdmin = filterAllPermissionsStartingWith(permissions, 'emo.admin');

    const [showOrgs, setShowOrgs] = useState(false);
    const hasOrganizationAccess = authorizeForResourceStartingWith(permissions, 'emo.admin.organizations');

    if (!isInitialized) {
        return <p>Loading...</p>;
    }

    return session ? (
        <div>
            <p>Name: {member?.name}</p>
            <p>Email: {member?.email_address}</p>
            <p>Organization: {organization?.organization_name}</p>
            <p>Roles: {member?.roles.map(r => r.role_id).join(', ')}</p>
            <br/>
            <div className="border m-3 p-4 bg-gray-100 w-lg">{hasAdminAccess ?
                !showAdminList ?
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowAdminList(true)}>Show Admin List</button>
                    :
                    <>
                        <Admin permissions={filteredPermissionsByAdmin}/>
                        <button className="bg-red-500 text-white font-bold py-1 px-1 my-1 rounded" onClick={() => setShowAdminList(false)}>Close Admin list</button>
                    </>
                : null
            }</div>

            <div className="border m-3 p-4 bg-gray-100 w-lg">
                {!showOrgs ?
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={!hasOrganizationAccess} onClick={() => setShowOrgs(true)}>Show organizations</button>
                    :
                    <>
                        <Orgs />
                        <button className="bg-red-500 text-white font-bold py-1 px-1 my-1 rounded" onClick={() => setShowOrgs(false)}>Close Orgs list</button>
                    </>
                }</div>
        </div>
    ) : (
        <p>No active session</p>
    );
};