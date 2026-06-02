"use client";

import { authClient } from "@/lib/auth-client";
import {
	Badge,
	Button,
	Callout,
	Card,
	Heading,
	SegmentedControl,
	Spinner,
	Text,
	TextField,
} from "@whop/react/components";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

type AuthTab = "login" | "signup";

function AuthField({
	label,
	id,
	...inputProps
}: {
	label: string;
	id: string;
} & React.ComponentProps<typeof TextField.Input>) {
	return (
		<div className="flex flex-col gap-1.5">
			<Text as="label" htmlFor={id} size="2" weight="medium">
				{label}
			</Text>
			<TextField.Root size="2" variant="surface">
				<TextField.Input id={id} {...inputProps} />
			</TextField.Root>
		</div>
	);
}

function AuthForms() {
	const router = useRouter();
	const [tab, setTab] = useState<AuthTab>("login");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSignIn(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const email = String(formData.get("email") ?? "");
		const password = String(formData.get("password") ?? "");

		const { error: signInError } = await authClient.signIn.email({
			email,
			password,
		});

		setIsSubmitting(false);

		if (signInError) {
			setError(signInError.message ?? "Unable to sign in. Please try again.");
			return;
		}

		router.refresh();
	}

	async function handleSignUp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const name = String(formData.get("name") ?? "");
		const email = String(formData.get("email") ?? "");
		const password = String(formData.get("password") ?? "");

		const { error: signUpError } = await authClient.signUp.email({
			name,
			email,
			password,
		});

		setIsSubmitting(false);

		if (signUpError) {
			setError(signUpError.message ?? "Unable to sign up. Please try again.");
			return;
		}

		router.push("/dashboard");
		router.refresh();
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-6">
			<Card size="3" variant="surface" className="w-full max-w-md">
				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-2 text-center">
						<Badge color="blue" variant="soft" className="self-center">
							Whop Tasks
						</Badge>
						<Heading size="6">Welcome to Whop Tasks</Heading>
						<Text size="3" color="gray">
							Sign in to post tasks, apply for work, and manage your
							marketplace activity.
						</Text>
					</div>

					<SegmentedControl.Root
						value={tab}
						onValueChange={(value) => {
							setTab(value as AuthTab);
							setError(null);
						}}
					>
						<SegmentedControl.List className="w-full">
							<SegmentedControl.Trigger value="login" className="flex-1">
								Log in
							</SegmentedControl.Trigger>
							<SegmentedControl.Trigger value="signup" className="flex-1">
								Sign up
							</SegmentedControl.Trigger>
						</SegmentedControl.List>

						<SegmentedControl.Content value="login" className="pt-4">
							<form className="flex flex-col gap-4" onSubmit={handleSignIn}>
								<AuthField
									label="Email"
									id="login-email"
									name="email"
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									required
								/>
								<AuthField
									label="Password"
									id="login-password"
									name="password"
									type="password"
									autoComplete="current-password"
									placeholder="Your password"
									required
								/>
								<Button
									type="submit"
									size="2"
									variant="solid"
									color="blue"
									disabled={isSubmitting}
									className="w-full"
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center gap-2">
											<Spinner size="1" />
											Signing in…
										</span>
									) : (
										"Log in"
									)}
								</Button>
							</form>
						</SegmentedControl.Content>

						<SegmentedControl.Content value="signup" className="pt-4">
							<form className="flex flex-col gap-4" onSubmit={handleSignUp}>
								<AuthField
									label="Name"
									id="signup-name"
									name="name"
									type="text"
									autoComplete="name"
									placeholder="Your name"
									required
								/>
								<AuthField
									label="Email"
									id="signup-email"
									name="email"
									type="email"
									autoComplete="email"
									placeholder="you@example.com"
									required
								/>
								<AuthField
									label="Password"
									id="signup-password"
									name="password"
									type="password"
									autoComplete="new-password"
									placeholder="At least 8 characters"
									minLength={8}
									required
								/>
								<Button
									type="submit"
									size="2"
									variant="solid"
									color="blue"
									disabled={isSubmitting}
									className="w-full"
								>
									{isSubmitting ? (
										<span className="flex items-center justify-center gap-2">
											<Spinner size="1" />
											Creating account…
										</span>
									) : (
										"Create account"
									)}
								</Button>
							</form>
						</SegmentedControl.Content>
					</SegmentedControl.Root>

					{error ? (
						<Callout.Root color="red" variant="soft">
							<Callout.Text>{error}</Callout.Text>
						</Callout.Root>
					) : null}
				</div>
			</Card>
		</div>
	);
}

export function AuthPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!isPending && session?.user) {
			router.replace("/dashboard");
		}
	}, [isPending, session?.user, router]);

	if (isPending || session?.user) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6">
				<Spinner size="3" />
				<Text size="2" color="gray">
					Loading…
				</Text>
			</div>
		);
	}

	return <AuthForms />;
}
