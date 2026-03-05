import {
    Entity, Enum, Property,
} from '@mikro-orm/postgresql';
import {Base} from '../base';
import {Organization} from "~/db/entities";
import {ManyToOne, Ref} from "@mikro-orm/core";

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

    // todo make generic (use ActivityTrackable)
    @ManyToOne(() => Organization, { ref: true })
    document: Ref<Organization>;

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
