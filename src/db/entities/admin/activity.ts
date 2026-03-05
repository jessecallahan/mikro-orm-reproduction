import {
    Entity, Enum, Property, wrap,
} from '@mikro-orm/postgresql';
import {Base} from '../base';
import {Organization} from "~/db/entities";
import {ManyToOne, Ref} from "@mikro-orm/core";
import type {ActivityTrackable} from "~/db/subscribers/activity-subscriber";

@Entity(
    {discriminatorColumn: 'documentType',}
)
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

    @ManyToOne()
    document: Organization;

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
        entity: Organization,
    ) {
        super();
        this.userEmail = userEmail;
        this.userName = userName;
        this.userObject = userObject;
        this.resource = resource;
        this.action = action;
        this.document = entity;
        this.entity = wrap(entity).toJSON();
    }
}
