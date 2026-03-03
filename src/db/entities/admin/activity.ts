import {
    Entity, Property,
} from '@mikro-orm/postgresql';
import { Base } from '../base';
    public

@Entity()
export class Activity extends Base {
    @Property()
    userEmail: string;

    @Property()
    userName: string;

    @Property({
        type: 'jsonb',
    })
    userObject: JSON;

    @Property()
    resource: string;

    @Property()
    action: string;

    // document

    @Property({
        type: 'jsonb',
    })
    entity: JSON;
}
