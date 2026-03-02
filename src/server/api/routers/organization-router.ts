
import { z } from 'zod';
import {createTRPCRouter, protectedProcedure} from '../../api/trpc';
import {wrap} from "@mikro-orm/postgresql";
import {Organization} from "~/db/entities";
import {OrganizationUpdateSchema} from "~/validators/organization-schema";

export const organizationRouter = createTRPCRouter({
    get: protectedProcedure()
        .input(z.number())
        .query(async ({ ctx, input: id }) => {
            const record = await ctx.db.findOneOrFail(Organization, id);
            return wrap(record).toObject();
        }),

    getAll: protectedProcedure('emo.admin.organizations', ['read.external', 'read.internal'])
        // // todo hasInternalAccess renmae
        // .use(isAuthorizedForCondition('isInternal', 'emo.admin.organizations', ['read.internal']))
        .query(async ({ctx, input}) => {
            let records = null;
            //
            // console.log('i', input);
            // if not authorized return nothing or error
            // if (!ctx.isAuthorized) {
            //     // todo return trpc error
            //     return records;
            // } else {
            //     // is internal
            //     if (ctx.isInternal) {
            //         records = await ctx.db.find(Organization, {}, {filters: { organizationFilter: {organizationSlug: input}}});
            //     } else {
            //         records = await ctx.db.find(Organization, {}, {exclude: ['id', 'notes'], filters: { organizationFilter: {organizationSlug: input}}});
            //     }
            // }

            records = await ctx.db.find(Organization, {});
            return records?.map((r) => wrap(r).toObject());
    }),

    update: protectedProcedure()
        .input(OrganizationUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const model = await ctx.db.findOneOrFail(
                Organization,
                input.id,
                {},
            );
            wrap(model).assign(input);
            await ctx.db.flush();
            return wrap(model).toObject();
        }),
});