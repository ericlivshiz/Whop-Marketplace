import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel, Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";

type ReadCtx = QueryCtx | MutationCtx;
type WriteCtx = MutationCtx;

type AuthUser = {
	_id: string;
	name: string;
	email: string;
};

export async function requireAuth(ctx: GenericCtx<DataModel>): Promise<AuthUser> {
	const user = await authComponent.getAuthUser(ctx);
	return {
		_id: user._id,
		name: user.name,
		email: user.email,
	};
}

export async function getOptionalAuthUser(
	ctx: GenericCtx<DataModel>,
): Promise<AuthUser | null> {
	const user = await authComponent.safeGetAuthUser(ctx);
	if (!user) {
		return null;
	}
	return {
		_id: user._id,
		name: user.name,
		email: user.email,
	};
}

function slugFromEmail(email: string): string {
	const local = email.split("@")[0] ?? "user";
	const slug = local
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.slice(0, 12);
	return slug.length > 0 ? slug : "user";
}

async function uniqueHandle(ctx: ReadCtx, base: string): Promise<string> {
	let handle = `@${base}`;
	let suffix = 0;

	while (true) {
		const existing = await ctx.db
			.query("profiles")
			.withIndex("by_handle", (q) => q.eq("handle", handle))
			.unique();

		if (!existing) {
			return handle;
		}

		suffix += 1;
		handle = `@${base}${suffix}`;
	}
}

export async function ensureProfile(
	ctx: WriteCtx,
	user: AuthUser,
): Promise<Doc<"profiles">> {
	const existing = await ctx.db
		.query("profiles")
		.withIndex("by_userId", (q) => q.eq("userId", user._id))
		.unique();

	if (existing) {
		return existing;
	}

	const base = slugFromEmail(user.email);
	const handle = await uniqueHandle(ctx, base);
	const now = Date.now();

	const profileId = await ctx.db.insert("profiles", {
		userId: user._id,
		name: user.name,
		handle,
		createdAt: now,
	});

	const profile = await ctx.db.get(profileId);
	if (!profile) {
		throw new Error("Failed to create profile");
	}
	return profile;
}

export async function getProfileByUserId(
	ctx: ReadCtx,
	userId: string,
): Promise<Doc<"profiles"> | null> {
	return await ctx.db
		.query("profiles")
		.withIndex("by_userId", (q) => q.eq("userId", userId))
		.unique();
}
