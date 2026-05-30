import {defineEntity, p} from "@mikro-orm/core";
import {Car} from "./car.entity";

const PartSchema = defineEntity({
    name: 'Part',
    properties: {
        id: p.integer().primary(),
        car: () => p.manyToOne(Car),
    },
});

export class Part extends PartSchema.class {}
PartSchema.setClass(Part);