import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

function hasLegacyApplicationFields(
	application: Record<string, unknown>,
): boolean {
	return "pitch" in application || "portfolioUrl" in application;
}

/**
 * Removes fields dropped from the applications schema (legacy apply form fields).
 * Safe to run multiple times.
 */
export const stripLegacyApplicationFields = internalMutation({
	args: {},
	returns: v.object({
		scanned: v.number(),
		updated: v.number(),
	}),
	handler: async (ctx) => {
		const applications = await ctx.db.query("applications").collect();
		let updated = 0;

		for (const application of applications) {
			const record = application as Record<string, unknown>;
			if (!hasLegacyApplicationFields(record)) {
				continue;
			}

			await ctx.db.replace(application._id, {
				taskId: application.taskId,
				applicantId: application.applicantId,
				status: application.status,
				createdAt: application.createdAt,
			});
			updated += 1;
		}

		return { scanned: applications.length, updated };
	},
});
