import {
    Check,
    Embedded,
    Entity,
    Enum,
    Property,
} from '@mikro-orm/postgresql';
import { Base } from '../base';
import {OrganizationType} from "~/db/enums/organization-type";
import {DateRange} from "~/db/entities/date-range";
import {Status} from "~/db/enums/status";
import {Filter} from "@mikro-orm/core";

/**
 * These are the organizations (business units) used to manage users and supply chain partner locations
 * with access to the eMO application.
 *
 * https://docs.google.com/spreadsheets/d/1vUM05YjC0aAMbJCFo0qH3xMgzEMrYReRCGFY1GFEWxY/edit?gid=797872787#gid=797872787
 **/
@Entity()
@Filter({ name: 'user', cond: async (args) => {
        // if (type !== 'read') {
        //     return {};
        // }
        //
        // if (args.user.roles.some('emo_supply_chain_partner')) {
        //     return {};
        // }

        return {
            organizationSlug: { $eq: args.user.organization_slug } ,
        };
    } })
export class Organization extends Base {
    @Property()
    organizationSlug: string;

    @Property({ unique: true })
    name: string;

    @Enum({
        items: () => OrganizationType,
        nativeEnumName: 'organization_type',
    })
    type: OrganizationType;

    // note: mikro-orm does not support adding check constraints on embeddable so add it to parent class
    @Embedded(() => DateRange)
    @Check({
        expression: (columns) =>
            `(${columns.effective_date_range_to} IS NULL) OR (${columns.effective_date_range_from} <= ${columns.effective_date_range_to})`,
    })
    effectiveDateRange: DateRange;

    @Property({ nullable: true })
    notes?: string;

    @Enum({
        items: () => Status,
        nativeEnumName: 'status',
    })
    status: Status;

    // // note: one-to-many used when using a not 'pure' pivot table (related entities with extra properties, in this case: stytchMemberId)
    // @OneToMany(
    //     () => OrganizationMembership,
    //     (membership) => membership.organization,
    // )
    // membership = new Collection<OrganizationMembership>(this);

    constructor(
        organizationSlug: string,
        name: string,
        type: OrganizationType,
        effectiveDateRange: DateRange,
        status: Status,
        notes?: string,
    ) {
        super();
        this.organizationSlug = organizationSlug;
        this.name = name;
        this.type = type;
        this.effectiveDateRange = effectiveDateRange;
        this.status = status;
        this.notes = notes;
    }
}
