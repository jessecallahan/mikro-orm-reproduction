import {z} from 'zod';
import {createTRPCRouter, hasInternalAccess, resourceProtectedProcedure} from '../../api/trpc';
import {wrap} from "@mikro-orm/postgresql";
import {Organization} from "~/db/entities";
import {OrganizationUpdateSchema} from "~/validators/organization-schema";

export const organizationRouter = createTRPCRouter({
    get: resourceProtectedProcedure()
        .input(z.number())
        .query(async ({ctx, input: id}) => {
            const record = await ctx.db.findOneOrFail(Organization, id);
            return wrap(record).toObject();
        }),

    getAll: resourceProtectedProcedure('emo.admin.organizations', 'read.external')
        .use(hasInternalAccess('emo.admin.organizations', 'read.internal'))
        .query(async ({ctx}) => {
            let excludedFields = ctx.hasInternalAccess ? [] : ['id', 'notes'];
            const records = await ctx.db.find(Organization, {}, {
                exclude: excludedFields,
                populate: ['activities']
            });

            return records?.map((r) => wrap(r).toObject());
        }),

    update: resourceProtectedProcedure('emo.admin.organizations', 'update')
        .input(OrganizationUpdateSchema)
        .mutation(async ({ctx, input}) => {
            const model = await ctx.db.findOneOrFail(
                Organization,
                input.id
            );

            wrap(model).assign(input);
            await ctx.db.flush();

            return wrap(model).toObject();
        }),
});