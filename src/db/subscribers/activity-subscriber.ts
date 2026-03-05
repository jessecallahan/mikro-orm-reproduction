import type {EntityName, EventSubscriber} from "@mikro-orm/core";
import {Organization} from "~/db/entities";
import {EventArgs, Property} from "@mikro-orm/postgresql";
import type {Members} from "stytch/types/lib/b2b/organizations_members";
import {Activity} from "~/db/entities/admin/activity";
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

    async afterCreate(
        args: EventArgs<ActivityTrackable>,
    ): Promise<void> {
        await this.createActivity(args);
    }

    async afterUpdate(
        args: EventArgs<ActivityTrackable>,
    ): Promise<void> {
        await this.createActivity(args);
    }

    async afterUpsert(
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

        // fail if no logger context
        if (!loggerContext || Object.keys(loggerContext).length === 0) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'No logger context', })
        }
        if (loggerContext.user) {
            const activity = new Activity(
                loggerContext.user.email_address,
                loggerContext.user.name,
                loggerContext.user,
                loggerContext.resource,
                loggerContext.action,
                args.entity
            );

            // Normally we would want to use create here for this use case
            // however create() and flush() can't be used in lifecycle hooks
            // https://mikro-orm.io/docs/events#limitations-of-lifecycle-hooks
            await em.upsert(Activity, activity);

        }

    }
}
