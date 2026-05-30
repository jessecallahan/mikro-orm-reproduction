import {defineEntity, p} from "@mikro-orm/core";
import {Car, Model} from "./car.entity";

const ModelASchema = defineEntity({
    name: 'ModelA',
    extends: Car,
    discriminatorValue: Model.A,
    properties: {
        id: p.integer().primary(),
    },
});

export class ModelA extends ModelASchema.class {}
ModelASchema.setClass(ModelA);