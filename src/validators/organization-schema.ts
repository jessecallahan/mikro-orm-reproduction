


import {z, ZodType} from 'zod';
import {OrganizationType} from "../db/enums/organization-type";
import {Status} from "../db/enums/status";
import {Organization} from "../db/entities";


const OrganizationSchema = z.object({
    id: z.number(),
    organizationSlug: z.string(),
    name: z.string(),
    type: z.string(),
    effectiveDateRange: z.object({
        from: z.date(),
        to: z
            .date()
            .optional() // database def
            .nullable() // ui input
    }),
    notes: z.string().nullable(),
    status: z.string()
}) satisfies ZodTimestampless<Organization>;

export const OrganizationUpdateSchema = OrganizationSchema;

export type ZodTimestampless<T> = ZodType<Omit<T, 'createdAt' | 'updatedAt'>>;