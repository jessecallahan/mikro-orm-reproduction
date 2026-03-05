import {
    Entity, Property,
} from '@mikro-orm/postgresql';
import {Base} from '../base';

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

    constructor(
        userEmail: string,
        userName: string,
        userObject: JSON,
        resource: string,
        action: string,
        // document
        entity: JSON,
    ) {
        super();
        this.userEmail = userEmail;
        this.userName = userName;
        this.userObject = userObject;
        this.resource = resource;
        this.action = action;
        this.entity = entity;
    }
}
