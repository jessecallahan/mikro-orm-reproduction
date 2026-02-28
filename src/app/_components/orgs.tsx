'use client';
import { api } from '~/trpc/react';

export const Orgs = ({organization}) => {
    // use to test protected route when user logged out
    // const organizations = api.organization.getAll.useQuery({session: session, member: member, organization: organization});
    const organizations = api.organization.getAll.useQuery(organization?.organization_slug ?? '');
    console.log(organizations);
    return (
        <div>
            orgs list
        </div>
    );
};