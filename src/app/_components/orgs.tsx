'use client';
import { api } from '~/trpc/react';
import {OrganizationType} from "~/db/enums/organization-type";
import {Status} from "~/db/enums/status";

export const Orgs = () => {
    // use to test protected route when user logged out
    // const organizations = api.organization.getAll.useQuery({session: session, member: member, organization: organization});
    const {data, isLoading} = api.organization.getAll.useQuery();
    const update = api.organization.update.useMutation({
        onSuccess: () => {
            // Invalidate queries to refresh data
            console.log('successful update')
        },
    })

    const upsertOrg = () => {
        update.mutate({
            id: 1,
            organizationSlug: '3-dimensional',
            name: '3Dimensional test',
            type: OrganizationType.SupplyChainPartner,
            effectiveDateRange: {
                from: new Date('2014-08-01'),
                to: new Date('2014-08-31'),
            },
            notes: 'notes',
            status: Status.Inactive
        })
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (
        <div>
            <ul>
                {data?.map(org => (
                    <li key={org.name}>
                        <strong>{org.name}</strong>
                    </li>
                ))}
            </ul>
            <button className="bg-green-500 text-white font-bold py-1 px-1 rounded"onClick={upsertOrg}>Upsert Org</button>
        </div>
    );
};