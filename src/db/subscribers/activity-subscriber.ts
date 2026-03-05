import type {EntityName, EventSubscriber} from "@mikro-orm/core";
import {Organization} from "~/db/entities";
import {EventArgs, Property} from "@mikro-orm/postgresql";
import type {Members} from "stytch/types/lib/b2b/organizations_members";
import {Activity} from "~/db/entities/admin/activity";
import {ChangeSetType} from "@mikro-orm/core";
import {TRPCError} from "@trpc/server";


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

    // modeled after: https://mikro-orm.io/docs/events#using-onflush-event
    // todo if we want this to be onupdate we can use upsert, is that what we want
    // finding the changeset by update essentially does the same thing but allows us to create
    // a new record ... https://mikro-orm.io/docs/events#limitations-of-lifecycle-hooks
    async onFlush(
        args: EventArgs<ActivityTrackable>,
    ): Promise<void> {
        await this.createActivity(args);
    }

    private async createActivity(
        args: EventArgs<ActivityTrackable>,
    ): Promise<void> {
        const em = args.em;
        const loggerContext = em.getLoggerContext<LoggerContext>();

        const changeSets = args.uow.getChangeSets();
        const cs = changeSets.find(cs => cs.type === ChangeSetType.UPDATE);

        // console.log('params', em.filterParams);
        console.log('logger', loggerContext);

        // fail if no logger context
        if (!loggerContext) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'No logger context', })
        }
        if (cs) {
            const activity = new Activity(
                loggerContext.user.email_address,
                loggerContext.user.name,
                loggerContext.user,
                loggerContext.resource,
                loggerContext.action,
                cs.entity
            );

            cs.entity.activities.add(activity);
            args.uow.computeChangeSet(activity);
            args.uow.recomputeSingleChangeSet(cs.entity);
        }

    }
}
