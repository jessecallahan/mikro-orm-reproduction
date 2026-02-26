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
        const defaultConfig = getConfig();
        orm = await MikroORM.init(defaultConfig);
    }

    return orm;
}

/**
 * Retrieve the default configuration
 */
function getConfig(contextName?: string): ReturnType<typeof defineConfig> {
    if (!Array.isArray(config)) {
        // If not an array, return the config
        return config;
    }

    // If array, find the default and return
    const defaultConfig = config.find(
        // Condition matches the behavior described in the documentation so that it aligns with the cli
        // @see https://mikro-orm.io/blog/mikro-orm-6-4-released#support-for-multiple-orm-configurations
        (x) =>
            contextName
                ? x.contextName === contextName
                : !x.contextName || x.contextName === 'default',
    );
    if (!defaultConfig) {
        throw new Error('The default context is missing from the config array.');
    }
    return defaultConfig;
}

// do we want to expose the core system types?
// export * from '@mikro-orm/core';
export { type MikroORM, wrap };
