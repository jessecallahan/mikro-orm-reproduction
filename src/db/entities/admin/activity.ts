import {ManyToOne} from "@mikro-orm/core";
import {
    Entity, Property,
} from '@mikro-orm/postgresql';
import type {Member} from "@stytch/nextjs/b2b";
import {Organization} from "~/db/entities";
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
    userObject: Member;

    @Property()
    resource: string;

    @Property()
    action: string;

    @ManyToOne()
    document: Organization;

    @Property({
        type: 'jsonb',
    })
    entity: Organization;

    constructor(
        userEmail: string,
        userName: string,
        userObject: Member,
        resource: string,
        action: string,
        entity: Organization,
    ) {
        super();
        this.userEmail = userEmail;
        this.userName = userName;
        this.userObject = userObject;
        this.resource = resource;
        this.action = action;
        this.document = entity;
        this.entity = entity;
    }
}
