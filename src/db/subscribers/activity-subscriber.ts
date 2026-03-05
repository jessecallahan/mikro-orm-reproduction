import type {EntityName, EventSubscriber} from "@mikro-orm/core";
import {Organization} from "~/db/entities";
import {EventArgs} from "@mikro-orm/postgresql";
import type {Members} from "stytch/types/lib/b2b/organizations_members";

export interface ActivityTrackable {
    id: number
}

export interface LoggerContext {
    resource: string;
    action: string;
    user: Members;
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
        const loggerContext = em.getLoggerContext<LoggerContext>();
        // console.log('params', em.filterParams);
        console.log('logger', loggerContext);

        // todo fail if no logger context
       // todo create activity record
    }
}
