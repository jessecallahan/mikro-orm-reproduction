import {defineEntity, p} from "@mikro-orm/core";
import {Car, Model} from "./car.entity";

const ModelBSchema = defineEntity({
    name: 'ModelB',
    extends: Car,
    discriminatorValue: Model.B,
    properties: {
        id: p.integer().primary(),
    },
});

export class ModelB extends ModelBSchema.class {}
ModelBSchema.setClass(ModelB);