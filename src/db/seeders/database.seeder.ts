import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import {User} from "../entities/admin/user";

export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const user = new User('nameish');
        em.persist(user);
    }
}
