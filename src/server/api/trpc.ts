/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import {initTRPC, TRPCError} from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import {getORM} from "~/db";
import stytch = require("stytch");
import {cookies} from "next/headers";


const client = new stytch.B2BClient({
	project_id: process.env.PROJECT_ID,
	secret: process.env.SECRET,
});

const userFilter = async (args, type) => {
	if (type !== 'read') {
	    return {};
	}

	// if not supply chain partner user don't apply filter
	if (args.user.roles.some(r => r.role_id === 'emo_supply_chain_partner')) {
	    return {};
	}

	return {
		organizationSlug: {$eq: args.organization.organization_slug},
	};
}
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
	const db = await getORM();

	return {
		db: db.em.fork(),
		...opts,
	};
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now();

	if (t._config.isDev) {
		// artificial delay in dev
		const waitMs = Math.floor(Math.random() * 400) + 100;
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}

	const result = await next();

	const end = Date.now();
	console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

	return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session` is not null.
 *
 * 1. Authorize the JWT on the cookies
 * 2. Authorize role access
 *
 * @see https://trpc.io/docs/procedures
 */
const authenticateStytchSession = async (opts, resource_id, actions) => {
	const {ctx, next} = opts;
	const cookieStore = await cookies();
	const session_jwt = cookieStore.get('stytch_session_jwt');

	if (!session_jwt?.value) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	// 1) authenticate session cookie
	return client.sessions.authenticateJwt({ session_jwt: session_jwt?.value })
		.then(async session => {
			let result = null

			// 2) add access to emo resource (authenticate by user (org id) and resource/action combo)
			// todo if no resource/action combo exists, authenticate that the user has access to any emo.* resource
			if (resource_id === undefined) {
				// result = await client.sessions.authenticate({
				// 	session_jwt: session_jwt?.value,
				// 	authorization_check: {
				// 		organization_id: ctx.session.member_session.organization_id,
				// 		resource_id: 'emo.*',
				// 		action: '*'
				// 	}
				// });
			} else {
				for (const action of actions) {
					try {
						// Await the asynchronous function call
						result = await client.sessions.authenticate({
							session_jwt: session_jwt?.value,
							authorization_check: {
								organization_id: session.member_session.organization_id,
								resource_id: resource_id,
								action: action
							}
						});
					} catch (error) {
						//console.error('Function failed for action:', action, error);
					}
				}
			}

			if (!result) {
				throw new TRPCError({code: 'UNAUTHORIZED'});
			}

			return next({
				ctx: {
					...ctx,
					// infers the `session` as non-nullable
					session: {...session},
					// temporal: new Client({
					// 	connection: await getConnection(),
					// 	namespace: env.TEMPORAL_NAMESPACE,
					// }),
				},
			})
		})
};

export const protectedProcedure = (resource?: string, actions?: string[]) =>
	t.procedure
	.use(timingMiddleware)
	.use((opts) => authenticateStytchSession(opts, resource, actions))
	.use(addFilters())

// input: condition, resource, actions
// loop over actions if one is authorized stop loop and return context with condition as true
// otherwise return context with condition false

// this method returns context attached with the condition given as either true or false
export const hasInternalAccess = (resource_id: string, actions: string[] ) =>
	t.middleware(async ({ ctx, next }) => {
		let result = null
		const cookieStore = await cookies();
		const session_jwt = cookieStore.get('stytch_session_jwt']);

		if (!session_jwt?.value) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		for (const action of actions) {
			try {
				// Await the asynchronous function call
				result = await client.sessions.authenticate({
					session_jwt: session_jwt?.value,
					authorization_check: {
						organization_id: ctx.session.member_session.organization_id,
						resource_id: resource_id,
						action: action
					}
				});

			} catch (error) {
				// console.error('Function failed for action:', action, error);
			}
		}

		if (!result) {
			result = false;
		}

		return next({
			ctx: {
				...ctx,
				isInternal: !!result,
			},
		})
	});

export const addFilters = () =>
	t.middleware(async ({ ctx, next }) => {
		// add filter
		ctx.db.addFilter('user', userFilter);
		// ctx.db.addFilter('user', args => ({ user: args.user_session }));

		// pass filter params
		const member = await client.organizations.members.get({
			organization_id: ctx.session.member_session.organization_id,
			member_id: ctx.session.member_session.member_id,
		})
		ctx.db.setFilterParams('user', { user: member.member, organization: member.organization });

		// console.log('[member]', member);
		return next({
			ctx: {
				...ctx
			},
		})
	});


