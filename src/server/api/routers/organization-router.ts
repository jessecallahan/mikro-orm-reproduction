
import { z } from 'zod';
import {createTRPCRouter, isAuthorizedForCondition, protectedProcedure} from '../../api/trpc';
import {wrap} from "@mikro-orm/postgresql";
import {Organization} from "~/db/entities";

export const organizationRouter = createTRPCRouter({
    get: protectedProcedure
        .input(z.number())
        .query(async ({ ctx, input: id }) => {
            const record = await ctx.db.findOneOrFail(Organization, id);
            return wrap(record).toObject();
        }),

    getAll: protectedProcedure
        .use(isAuthorizedForCondition('isAuthorized', 'emo.admin.organizations', ['read.external', 'read.internal']))
        .use(isAuthorizedForCondition('isInternal', 'emo.admin.organizations', ['read.internal']))
        .query(async ({ctx}) => {
            let records = null;
            // if not authorized return nothing or error
            if (!ctx.isAuthorized) {
                return records;
            } else {
                // is internal
                if (ctx.isInternal) {
                    records = await ctx.db.find(Organization, {});
                } else {
                    records = await ctx.db.find(Organization, {}, {exclude: ['notes']});
                }
            }

            return records?.map((r) => wrap(r).toObject());
    }),
});