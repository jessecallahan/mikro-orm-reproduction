'use client';
import { api } from '~/trpc/react';
import {OrganizationType} from "../../db/enums/organization-type";
import {Status} from "~/db/enums/status";
import type {OrganizationUpdateSchema} from "~/validators/organization-schema";
import {z} from "zod";

export const Orgs = () => {
    const {data, isLoading} = api.organization.getAll.useQuery();
    const update = api.organization.update.useMutation({
        onSuccess: () => {
            // Invalidate queries to refresh data
            console.log('successful update')
        },
    })

    const updateOrg = async () => {
        const defaultValues: z.input<typeof OrganizationUpdateSchema> = {
            id: 2,
            organizationSlug: 'honda-trading-raw-materials',
            name: 'Honda Trading Raw Materials test',
            type: OrganizationType.HondaTrading,
            effectiveDateRange: {
                from: new Date('9/12/2006'),
                to: null,
            },
            notes: 'Used for all users that have Honda Trading roles.  No supply-chain partner locations can be created under this organization.',
            status: Status.Active
        };

        return await update.mutateAsync(defaultValues)
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
                        {org.id ? <strong>{org.id} - </strong> : ''}
                        <strong>{org.name}</strong>
                    </li>
                ))}
            </ul>
            <button className="bg-green-500 text-white font-bold py-1 px-1 rounded" onClick={updateOrg}>Update Org</button>
        </div>
    );
};