import { internalMutation } from "./_generated/server";
import { LEGACY_APPLICATION_PITCH } from "./lib/applicationDto";

/** Backfill applications created before pitch was required. Safe to run multiple times. */
export const backfillApplicationPitches = internalMutation({
	args: {},
	handler: async (ctx) => {
		const applications = await ctx.db.query("applications").collect();
		let updated = 0;

		for (const application of applications) {
			if (application.pitch === undefined) {
				await ctx.db.patch(application._id, {
					pitch: LEGACY_APPLICATION_PITCH,
				});
				updated += 1;
			}
		}

		return { updated, total: applications.length };
	},
});

/** Remove legacy applications that have no pitch (alternative to backfill). */
export const deleteLegacyApplications = internalMutation({
	args: {},
	handler: async (ctx) => {
		const applications = await ctx.db.query("applications").collect();
		let deleted = 0;

		for (const application of applications) {
			if (application.pitch === undefined) {
				await ctx.db.delete(application._id);
				deleted += 1;
			}
		}

		return { deleted };
	},
});
