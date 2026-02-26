import {defineConfig} from '@mikro-orm/postgresql';
import process from "node:process";
import {User} from "~/db/admin/user"; // or any other driver package

export default [
    defineConfig({
        entities: [
            User
        ],
        seeder: {
            // look in subdirectories so that you can run individual seeders
            glob: '**/!(*.d).{js,ts}',
        },
        dbName: 'stytch-prototype',
        user: 'stytch',
        password: process.env.POSTGRES_PASSWORD,
        host: 'localhost',
        port: 5435,
    })
];