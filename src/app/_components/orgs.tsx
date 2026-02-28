'use client';
import { api } from '~/trpc/react';

export const Orgs = ({organization}) => {
    // use to test protected route when user logged out
    // const organizations = api.organization.getAll.useQuery({session: session, member: member, organization: organization});
    const {data, isLoading} = api.organization.getAll.useQuery(organization?.organization_slug ?? '');
    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (
        <div>
            {data?.map(org => (
            <li key={org.id}>
                <strong>{org.name}</strong>
            </li>
            ))}
        </div>
    );
};