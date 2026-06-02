"use client";

import { Theme } from "@whop/react/components";

export function FrostedProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Theme accentColor="blue" appearance="inherit">
			{children}
		</Theme>
	);
}
