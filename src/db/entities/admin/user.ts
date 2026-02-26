import {Entity, PrimaryKey, Property} from "@mikro-orm/core";

@Entity()
export class User {

    @PrimaryKey()
    id: bigint;

    @Property()
    name: string;

    // @Property()
    // email: string;
    //
    // @Property()
    // email: string;
    //
    // @Property()
    // email: string;

    constructor(name: string) {
        this.name = name;
    }

}