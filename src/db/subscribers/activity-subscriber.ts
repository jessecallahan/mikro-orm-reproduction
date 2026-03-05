import type {EntityName, EventSubscriber} from "@mikro-orm/core";
import {Organization} from "~/db/entities";
import {EventArgs} from "@mikro-orm/postgresql";

// ActivityTrackable
export interface ActivityTrackable {
    id: number
}

export class ActivitySubscriber
    implements EventSubscriber<ActivityTrackable>
{
    // note: add all entities that we want action trackable to this return array
    getSubscribedEntities(): EntityName<ActivityTrackable>[] {
        return [Organization];
    }

    async afterUpdate(
        args: EventArgs<ActivityTrackable>,
    ): Promise<void> {
        await this.createActivity(args);
    }

    private async createActivity(
        args: EventArgs<ActivityTrackable>,
    ): Promise<void> {
        const em = args.em;
        // console.log('params', em.filterParams);
        console.log('logger', em.getLoggerContext());

        // todo fail if no logger context
       // todo create activity record
    }
}
