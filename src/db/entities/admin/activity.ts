import {
    Entity,
} from '@mikro-orm/postgresql';
import { Base } from '../base';


@Entity()
export class Activity extends Base {


    constructor(
    ) {
        super();
    }
}
