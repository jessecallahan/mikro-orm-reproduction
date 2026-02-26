import {defineConfig} from '@mikro-orm/postgresql';
import {User} from "../db/entities";
import {SeedManager} from "@mikro-orm/seeder";


export default defineConfig({
        entities: [User],
        extensions: [SeedManager],
        seeder: {
            path: './src/db/seeders', // path to the folder with seeders
            pathTs: undefined, // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
            defaultSeeder: 'DatabaseSeeder', // default seeder class name
            glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
            emit: 'ts', // seeder generation mode
            fileName: (className: string) => className, // seeder file naming convention
        },
        dbName: 'postgres',
        user: 'stytch',
        password: 'admin123',
        host: 'localhost',
        port: 5435,
    });