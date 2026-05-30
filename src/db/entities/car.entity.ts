import {BaseEntity, defineEntity, p} from "@mikro-orm/core";

import {Part} from "./part.entity";

export enum Model {
    A = 'A',
    B = 'B',
}

const CarSchema = defineEntity({
    name: 'Car',
    extends: BaseEntity,
    discriminator: 'model',
    abstract: true,
    properties: {
        id: p.integer().primary(),
        model: p.enum(() => Model),
        parts: () => p.oneToMany(Part)
            .mappedBy('car'),
    },
});

export class Car extends CarSchema.class {}
CarSchema.setClass(Car);