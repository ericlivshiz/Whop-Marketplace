import { ConvexError } from "convex/values";

export const PITCH_MIN = 50;
export const PITCH_MAX = 1500;

export function validatePitch(pitch: string): string {
	const trimmed = pitch.trim();
	if (trimmed.length < PITCH_MIN) {
		throw new ConvexError(
			`Pitch must be at least ${PITCH_MIN} characters`,
		);
	}
	if (trimmed.length > PITCH_MAX) {
		throw new ConvexError(
			`Pitch must be at most ${PITCH_MAX} characters`,
		);
	}
	return trimmed;
}

export function validatePortfolioUrl(
	portfolioUrl: string | undefined,
): string | undefined {
	if (portfolioUrl === undefined || portfolioUrl.trim().length === 0) {
		return undefined;
	}
	const trimmed = portfolioUrl.trim();
	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new ConvexError("Portfolio link must use http or https");
		}
		return trimmed;
	} catch {
		throw new ConvexError("Portfolio link must be a valid URL");
	}
}
