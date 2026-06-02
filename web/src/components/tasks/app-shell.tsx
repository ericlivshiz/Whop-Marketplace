"use client";

import { authClient } from "@/lib/auth-client";
import {
	Avatar,
	Button,
	Heading,
	IconButton,
	Separator,
	Spinner,
	Text,
} from "@whop/react/components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const NAV_ITEMS = [
	{ href: "/browse", label: "Browse" },
	{ href: "/tasks/new", label: "Post task" },
	{ href: "/my-tasks", label: "My tasks" },
] as const;

function WhopMark() {
	return (
		<div className="flex size-8 items-center justify-center rounded-lg bg-blue-9 shadow-sm">
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden
			>
				<path
					d="M6 18L12 6L18 18H6Z"
					fill="white"
					fillOpacity="0.95"
				/>
			</svg>
		</div>
	);
}

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user;

	useEffect(() => {
		if (!isPending && !session?.user) {
			router.replace("/");
		}
	}, [isPending, session?.user, router]);

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/");
		router.refresh();
	}

	if (isPending || !session?.user) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-1">
				<Spinner size="3" />
				<Text size="2" color="gray">
					Loading…
				</Text>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-1">
			<header className="sticky top-0 z-20 border-b border-gray-6 bg-gray-1/90 backdrop-blur-md">
				<div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
					<Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
						<WhopMark />
						<div className="hidden sm:block">
							<Heading size="3">Whop Tasks</Heading>
						</div>
					</Link>

					<nav className="flex flex-1 items-center justify-center gap-1">
						{NAV_ITEMS.map((item) => {
							const isActive = pathname.startsWith(item.href);

							return (
								<Link key={item.href} href={item.href}>
									<Button
										size="2"
										variant={isActive ? "soft" : "ghost"}
										color={isActive ? "blue" : "gray"}
									>
										{item.label}
									</Button>
								</Link>
							);
						})}
					</nav>

					<div className="flex items-center gap-2 shrink-0">
						<Link href="/tasks/new" className="hidden md:block">
							<Button size="2" variant="solid" color="blue">
								Post task
							</Button>
						</Link>
						<Separator orientation="vertical" className="h-6 hidden sm:block" />
						<div className="flex items-center gap-2">
							<Avatar
								size="2"
								fallback={user?.name?.slice(0, 1) ?? "?"}
								color="blue"
							/>
							<div className="hidden lg:block max-w-[120px]">
								<Text size="2" weight="medium" className="truncate">
									{user?.name ?? "Member"}
								</Text>
							</div>
							<IconButton
								size="2"
								variant="ghost"
								color="gray"
								aria-label="Sign out"
								onClick={handleSignOut}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden
								>
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
									<path d="M16 17l5-5-5-5M21 12H9" />
								</svg>
							</IconButton>
						</div>
					</div>
				</div>
			</header>

			<main
				className={`mx-auto max-w-6xl px-4 sm:px-6 ${pathname.startsWith("/tasks/new") ? "py-6" : "py-8"}`}
			>
				{children}
			</main>
		</div>
	);
}
