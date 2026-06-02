import { v } from "convex/values";
import { query } from "./_generated/server";
import { getProfileByUserId, requireAuth } from "./lib/auth";
import { profileMineValidator } from "./lib/validators";

export const getMine = query({
	args: {},
	returns: v.union(profileMineValidator, v.null()),
	handler: async (ctx) => {
		const user = await requireAuth(ctx);
		const profile = await getProfileByUserId(ctx, user._id);
		if (!profile) {
			return null;
		}
		return {
			name: profile.name,
			handle: profile.handle,
		};
	},
});
