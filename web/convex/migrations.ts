import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/** Remove applications missing required pitch data. Safe to run multiple times. */
export const deleteLegacyApplications = internalMutation({
	args: {},
	returns: v.object({
		deleted: v.number(),
		total: v.number(),
	}),
	handler: async (ctx) => {
		const applications = await ctx.db.query("applications").collect();
		let deleted = 0;

		for (const application of applications) {
			if (application.pitch === undefined) {
				await ctx.db.delete(application._id);
				deleted += 1;
			}
		}

		return { deleted, total: applications.length };
	},
});
