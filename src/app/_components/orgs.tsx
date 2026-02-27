'use client';
import { api } from '~/trpc/react';

export const Orgs = () => {
    const organizations = api.organization.getAll.useQuery();

    console.log(organizations);
    return (
        <div>
            orgs list
        </div>
    );
};