import {z} from 'zod';
import {createTRPCRouter, hasInternalAccess, protectedProcedure} from '../../api/trpc';
import {wrap} from "@mikro-orm/postgresql";
import {Organization} from "~/db/entities";
import {OrganizationUpdateSchema} from "~/validators/organization-schema";

export const organizationRouter = createTRPCRouter({
    get: protectedProcedure()
        .input(z.number())
        .query(async ({ctx, input: id}) => {
            const record = await ctx.db.findOneOrFail(Organization, id);
            return wrap(record).toObject();
        }),

    getAll: protectedProcedure('emo.admin.organizations', ['read.external', 'read.internal'])
        .use(hasInternalAccess('emo.admin.organizations', ['read.internal']))
        .query(async ({ctx}) => {
            let records = null;
            if (ctx.isInternal) {
                records = await ctx.db.find(Organization, {});
            } else {
                records = await ctx.db.find(Organization, {}, {
                    exclude: ['id', 'notes']
                });
            }
            return records?.map((r) => wrap(r).toObject());
        }),

    update: protectedProcedure('emo.admin.organizations', ['update'])
        .input(OrganizationUpdateSchema)
        .mutation(async ({ctx, input}) => {
            const fork = ctx.db.fork({
                loggerContext: {
                    resource: 'emo.admin.organizations',
                    action: 'update'
                }
            });
            const model = await fork.findOneOrFail(
                Organization,
                input.id
            );

            wrap(model).assign(input);
            await fork.flush();
            return wrap(model).toObject();
        }),
});