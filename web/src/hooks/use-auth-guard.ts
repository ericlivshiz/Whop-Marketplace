"use client";

import { authClient } from "@/lib/auth-client";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthGuardMode = "require-auth" | "require-guest";

export function useAuthGuard(mode: AuthGuardMode) {
	const router = useRouter();
	const { isAuthenticated, isLoading: isConvexAuthLoading } = useConvexAuth();
	const { data: session, isPending: isSessionPending } = authClient.useSession();

	const isSettling = isSessionPending || isConvexAuthLoading;
	const isLoggedIn = Boolean(session?.user) && isAuthenticated;

	useEffect(() => {
		if (isSettling) {
			return;
		}

		if (mode === "require-auth" && !isLoggedIn) {
			router.replace("/");
			return;
		}

		if (mode === "require-guest" && isLoggedIn) {
			router.replace("/dashboard");
		}
	}, [isLoggedIn, isSettling, mode, router]);

	return {
		isSettling,
		isLoggedIn,
		user: session?.user,
	};
}
