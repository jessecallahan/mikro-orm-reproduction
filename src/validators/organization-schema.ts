


import {z, ZodType} from 'zod';
import {Organization} from "../db/entities";
import {OrganizationType} from "../db/enums/organization-type";
import {Status} from "~/db/enums/status";


const OrganizationSchema = z.object({
    id: z.number(),
    organizationSlug: z.string(),
    name: z.string(),
    type: z.enum(OrganizationType),
    effectiveDateRange: z.object({
        from: z.date(),
        to: z
            .date()
            .optional() // database def
    }),
    notes: z.string()
            .optional(), // database def
    status: z.enum(Status)
}) satisfies ZodTimestampless<Organization>;

export const OrganizationUpdateSchema = OrganizationSchema;

export type ZodTimestampless<T> = ZodType<Omit<T, 'createdAt' | 'updatedAt'>>;