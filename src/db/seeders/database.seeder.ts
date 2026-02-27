import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import {OrganizationMembershipSeeder} from "~/db/seeders/organization-membership-seeder";

export class DatabaseSeeder extends Seeder {
    run(em: EntityManager): Promise<void> {
        return this.call(em, [

            OrganizationMembershipSeeder,

        ]);
    }
}
