import { authClient } from "@/lib/auth-client";

const SESSION_POLL_INTERVAL_MS = 50;
const SESSION_POLL_MAX_ATTEMPTS = 40;

async function waitForSessionState(
	expectAuthenticated: boolean,
): Promise<boolean> {
	for (let attempt = 0; attempt < SESSION_POLL_MAX_ATTEMPTS; attempt += 1) {
		const { data } = await authClient.getSession({
			fetchOptions: { cache: "no-store" },
		});
		const isAuthenticated = Boolean(data?.user);

		if (isAuthenticated === expectAuthenticated) {
			return true;
		}

		await new Promise((resolve) => {
			setTimeout(resolve, SESSION_POLL_INTERVAL_MS);
		});
	}

	return false;
}

export async function syncAuthenticatedSession() {
	const sessionReady = await waitForSessionState(true);
	if (!sessionReady) {
		throw new Error(
			"Unable to confirm your session. Please try signing in again.",
		);
	}

	await authClient.convex.token({ fetchOptions: { throw: false } });
}

export async function syncSignedOutSession() {
	await waitForSessionState(false);
}
