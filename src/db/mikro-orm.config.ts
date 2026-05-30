import {defineConfig} from '@mikro-orm/postgresql';
import { Car } from './entities/car.entity';
import { ModelA } from './entities/model-a.entity';
import { ModelB } from './entities/model-b.entity';
import { Part } from './entities/part.entity';



export default defineConfig({
        entities: [Car, ModelA, ModelB, Part],
        dbName: 'postgres',
        user: 'reproduction',
        password: 'repro',
        host: 'localhost',
        port: 5435,
    });