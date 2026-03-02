import type {EntityName, EventSubscriber} from "@mikro-orm/core";
import {Organization} from "~/db/entities";
import {EventArgs} from "@mikro-orm/postgresql";


export class OrganizationSubscriber
    implements EventSubscriber<Organization>
{
    getSubscribedEntities(): EntityName<Organization>[] {
        return [Organization];
    }

    async afterUpdate(
        args: EventArgs<Organization>,
    ): Promise<void> {
        await this.upsertOrganization(args);
    }

    private async upsertOrganization(
        args: EventArgs<Organization>,
    ): Promise<void> {
        console.log('args', args);

        // Upsert "blank" material buyer records, ignoring any records that already exist
        // await em.upsertMany(
        //     Organization,
        //     getPermutations().map((blankRecord) => ({
        //         location: location.id,
        //         ...blankRecord,
        //     })),
        //     {
        //         onConflictAction: 'ignore',
        //     },
        // );
    }
}
