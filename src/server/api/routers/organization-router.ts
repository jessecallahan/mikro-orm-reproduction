
import { z } from 'zod';
import {createTRPCRouter, isAuthorizedForCondition, protectedProcedure} from '../../api/trpc';
import {wrap} from "@mikro-orm/postgresql";
import {Organization} from "~/db/entities";
import {MemberSession, Member, Organization as StytchOrg} from '@stytch/nextjs/b2b'

export const organizationRouter = createTRPCRouter({
    get: protectedProcedure
        .input(z.number())
        .query(async ({ ctx, input: id }) => {
            const record = await ctx.db.findOneOrFail(Organization, id);
            return wrap(record).toObject();
        }),

    getAll: protectedProcedure
        .input(
            // z.object(
            // {
            //     session: z.infer<typeof MemberSession>,
            //     member: z.infer<typeof Member>,
            //     organization: z.infer<typeof StytchOrg>,
            // }
            // )
            z.string()
        )
        .use(isAuthorizedForCondition('isAuthorized', 'emo.admin.organizations', ['read.external', 'read.internal']))
        .use(isAuthorizedForCondition('isInternal', 'emo.admin.organizations', ['read.internal']))
        .query(async ({ctx, input}) => {
            let records = null;

            console.log('i', input);
            // if not authorized return nothing or error
            if (!ctx.isAuthorized) {
                return records;
            } else {
                // is internal
                if (ctx.isInternal) {
                    records = await ctx.db.find(Organization, {}, {filters: { organizationFilter: {organizationSlug: input}}});
                } else {
                    records = await ctx.db.find(Organization, {}, {exclude: ['notes'], filters: { organizationFilter: {organizationSlug: input}}});
                }
            }

            return records?.map((r) => wrap(r).toObject());
    }),
});