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
        await this.createActivity(args);
    }

    private async createActivity(
        args: EventArgs<Organization>,
    ): Promise<void> {
        const em = args.em;
        console.log('params', em.filterParams);
        console.log('logger', em.getLoggerContext());

       // todo create activity record
    }
}
