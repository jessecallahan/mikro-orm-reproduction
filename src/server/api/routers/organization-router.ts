
import { z } from 'zod';
import {createTRPCRouter, publicProcedure} from '../../api/trpc';
import {wrap} from "@mikro-orm/postgresql";
import {Organization} from "~/db/entities";

export const organizationRouter = createTRPCRouter({
    get: publicProcedure
        .input(z.number())
        .query(async ({ ctx, input: id }) => {
            const record = await ctx.db.findOneOrFail(Organization, id);
            return wrap(record).toObject();
        }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const records = await ctx.db.find(Organization, {});
        return records.map((r) => wrap(r).toObject());
    }),
});
