


import {z, ZodType} from 'zod';
import {OrganizationType} from "~/db/enums/organization-type";
import {Organization} from "~/db/entities";
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
            .nullable() // ui input
            // strip out null
            .transform((value) => value ?? undefined),
    }),
    notes: z.string().nullable(),
    status: z.enum(Status)
}) satisfies ZodTimestampless<Organization>;

export const OrganizationUpdateSchema = OrganizationSchema;

export type ZodTimestampless<T> = ZodType<Omit<T, 'createdAt' | 'updatedAt'>>;