import {
    defineConfig,
    MikroORM,
    type Options,
    wrap,
} from '@mikro-orm/postgresql';
import config from './mikro-orm.config.ts';

let orm: MikroORM | null = null;

/**
 * Returns the global MikroORM object, creating it first if it does not yet exist.
 */
export async function getORM(options?: Options): Promise<MikroORM> {
    if (!orm) {
        orm = await MikroORM.init(config);
    }

    return orm;
}

// do we want to expose the core system types?
// export * from '@mikro-orm/core';
export { type MikroORM, wrap };
