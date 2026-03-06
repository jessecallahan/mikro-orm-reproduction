import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import {Organization} from "~/db/entities";
import {OrganizationType} from "~/db/enums/organization-type";
import {DateRange} from "~/db/entities/date-range";
import {Status} from "~/db/enums/status";


/**
 * Seeded data comes from here:
 *
 * https://docs.google.com/spreadsheets/d/1vUM05YjC0aAMbJCFo0qH3xMgzEMrYReRCGFY1GFEWxY/edit?gid=797872787#gid=797872787
 * https://docs.google.com/spreadsheets/d/1vUM05YjC0aAMbJCFo0qH3xMgzEMrYReRCGFY1GFEWxY/edit?gid=514872210#gid=514872210
 **/
export enum OrganizationNameSeedData {
    THD = '3Dimensional',
    HT = 'Honda Trading Raw Materials',
    KTH = 'KTH Parts Industries, Inc.',
    GONE = 'G-ONE AUTO PARTS DE MEXICO S.A. DE C.V.',
    YTI = 'Yutaka Technologies, Inc.',
    HICS = 'Honda Intra-Company Sales',
    USS = 'US Steel',
    USSC = 'US Steel Canada',
    TWB = 'TWB de Mexico S.A. de C.V.',
    PSI = 'Precision Strip Inc.',
    STI = 'Steel Technologies, Inc.',
    CSI = 'Cliffs Steel Inc',
}

const OrganizationSeedData = [
    new Organization(
        '3-dimensional',
        OrganizationNameSeedData.THD,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('8/1/2014'), new Date('8/31/2014')),
        Status.Inactive,
    ),
    new Organization(
        'honda-trading-raw-materials',
        OrganizationNameSeedData.HT,
        OrganizationType.HondaTrading,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
        'Used for all users that have Honda Trading roles.  No supply-chain partner locations can be created under this organization.',
    ),
    new Organization(
        'honda-intra-company-sales',
        OrganizationNameSeedData.HICS,
        OrganizationType.IntraCompanySales,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
        'Used for setting up and managing Honda locations & users as part suppliers & sources for intra-company sales.',
    ),
    new Organization(
        'us-steel',
        OrganizationNameSeedData.USS,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
        'USS',
    ),
    new Organization(
        'us-steel-canada',
        OrganizationNameSeedData.USSC,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
        'Stelco',
    ),
    new Organization(
        'kth-parts',
        OrganizationNameSeedData.KTH,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
    new Organization(
        'twb-mexico',
        OrganizationNameSeedData.TWB,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
    new Organization(
        'precision-strip',
        OrganizationNameSeedData.PSI,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
    new Organization(
        'cliffs-steel',
        OrganizationNameSeedData.CSI,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
    new Organization(
        'g-one-auto-parts-mexico',
        OrganizationNameSeedData.GONE,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
    new Organization(
        'yutaka',
        OrganizationNameSeedData.YTI,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
    new Organization(
        'steel-tech',
        OrganizationNameSeedData.STI,
        OrganizationType.SupplyChainPartner,
        new DateRange(new Date('9/12/2006')),
        Status.Active,
    ),
];

export class OrganizationMembershipSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const fork = em.fork({
            loggerContext: {
                resource: 'emo.admin.organzation',
                action: 'create',
                user: null
            }
        });

        // upsert Organizations
        await fork.upsertMany(Organization, OrganizationSeedData, {
            onConflictFields: ['name'],
            onConflictAction: 'merge',
        });
        await fork.flush();

        // filter User seed data where User is part of Organizations
        // const usersInOrganizations = userSeedData(em).filter(
        //     (u) => u.organizations !== undefined,
        // );

        // Update user organizations; we need to delete all first and then add to handle cases where we remove
        // organizations from the user seed data (upsert will just skip these)
        // Upserts do not handle relational entities: https://github.com/mikro-orm/mikro-orm/discussions/4708
        // for (const user of usersInOrganizations) {
        //     const foundUser = await em.findOneOrFail(User, { email: user.email });
        //     if (foundUser) {
        //         // delete existing organization memberships for this user
        //         const userMemberships = await em.find(OrganizationMembership, {
        //             user: foundUser,
        //         });
        //         userMemberships.forEach((membership) => {
        //             em.remove(membership);
        //         });
        //         await em.flush();
        //
        //         // add organization memberships for this user
        //         const orgs = await em.find(Organization, {
        //             name: user.organizations,
        //         });
        //         await em.upsertMany(
        //             OrganizationMembership,
        //             orgs.map((org) => {
        //                 return {
        //                     user: foundUser,
        //                     organization: org,
        //                 };
        //             }),
        //         );
        //         await em.flush();
        //     }
        // }
    }
}
