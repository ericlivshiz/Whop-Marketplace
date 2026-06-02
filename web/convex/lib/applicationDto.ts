import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { getProfileByUserId } from "./auth";

export const LEGACY_APPLICATION_PITCH =
	"This application was submitted before pitch details were required.";

export function applicationPitch(application: Doc<"applications">): string {
	return application.pitch ?? LEGACY_APPLICATION_PITCH;
}

export type ApplicationDto = {
	id: string;
	applicantName: string;
	applicantHandle: string;
	pitch: string;
	portfolioUrl?: string;
	createdAt: number;
	status: Doc<"applications">["status"];
};

export async function applicationToDto(
	ctx: QueryCtx,
	application: Doc<"applications">,
): Promise<ApplicationDto | null> {
	const profile = await getProfileByUserId(ctx, application.applicantId);
	if (!profile) {
		return null;
	}

	return {
		id: application._id,
		applicantName: profile.name,
		applicantHandle: profile.handle,
		pitch: applicationPitch(application),
		...(application.portfolioUrl
			? { portfolioUrl: application.portfolioUrl }
			: {}),
		createdAt: application.createdAt,
		status: application.status,
	};
}
