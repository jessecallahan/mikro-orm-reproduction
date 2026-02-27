import { DateType } from '@mikro-orm/core';
import { Embeddable, Property } from '@mikro-orm/postgresql';

/**
 * These are the complex types that is used on various models in eMO Next.
 *
 * https://docs.google.com/spreadsheets/d/1vUM05YjC0aAMbJCFo0qH3xMgzEMrYReRCGFY1GFEWxY/edit?gid=1041966394#gid=1041966394
 *
 * note: mikro-orm does not support adding check constraints on embeddable so validation like below needs
 * to be added to any class using embeddable
 *
 * team example:
 * @Check({
 * 		expression: (columns) =>
 * 			`(${columns.effective_date_range_to} IS NULL) OR (${columns.effective_date_range_from} <= ${columns.effective_date_range_to})`,
 * 	})
 **/
@Embeddable()
export class DateRange {
    @Property({ type: DateType })
    from: Date;

    @Property({ type: DateType, nullable: true })
    to?: Date;

    constructor(from: Date, to?: Date) {
        this.from = from;
        this.to = to;
    }
}
