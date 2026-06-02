"use client";

import { authClient } from "@/lib/auth-client";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
	Avatar,
	Button,
	Callout,
	Dialog,
	Separator,
	Text,
	TextArea,
	TextField,
} from "@whop/react/components";
import { useMutation, useQuery } from "convex/react";
import { type FormEvent, useState } from "react";

const PITCH_MIN = 50;
const PITCH_MAX = 1500;

function FormField({
	label,
	id,
	hint,
	children,
}: {
	label: string;
	id: string;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Text as="label" htmlFor={id} size="2" weight="medium">
				{label}
			</Text>
			{children}
			{hint ? (
				<Text size="1" color="gray">
					{hint}
				</Text>
			) : null}
		</div>
	);
}

export function ApplyToTaskDialog({
	open,
	onOpenChange,
	taskId,
	taskTitle,
	budgetLabel,
	onSuccess,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	taskId: Id<"tasks">;
	taskTitle: string;
	budgetLabel: string;
	onSuccess: () => void;
}) {
	const { data: session } = authClient.useSession();
	const profile = useQuery(api.profiles.getMine);
	const applyToTask = useMutation(api.applications.apply);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [pitch, setPitch] = useState("");

	const displayName = profile?.name ?? session?.user?.name ?? "Member";
	const displayHandle = profile?.handle ?? "—";
	const pitchLength = pitch.trim().length;
	const pitchValid = pitchLength >= PITCH_MIN && pitchLength <= PITCH_MAX;

	function resetForm() {
		setPitch("");
		setError(null);
		setIsSubmitting(false);
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			resetForm();
		}
		onOpenChange(nextOpen);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const pitchValue = String(formData.get("pitch") ?? "");
		const portfolioUrlRaw = String(formData.get("portfolioUrl") ?? "").trim();

		try {
			await applyToTask({
				taskId,
				pitch: pitchValue,
				...(portfolioUrlRaw.length > 0
					? { portfolioUrl: portfolioUrlRaw }
					: {}),
			});
			handleOpenChange(false);
			onSuccess();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to submit application",
			);
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Content
				size="3"
				className="max-w-lg"
				style={{ maxWidth: 520 }}
			>
				<Dialog.Title>Apply for this task</Dialog.Title>
				<Dialog.Description>
					Tell the poster why you&apos;re a good fit. They&apos;ll get an
					in-app notification with your pitch.
				</Dialog.Description>

				<div className="mt-4 rounded-xl border border-gray-6 bg-gray-2 px-4 py-3">
					<Text size="1" color="gray" weight="medium" className="uppercase tracking-wide">
						Task
					</Text>
					<Text size="3" weight="medium" className="mt-1 line-clamp-2 leading-snug">
						{taskTitle}
					</Text>
					<Text size="2" color="gray" className="mt-1">
						Budget {budgetLabel}
					</Text>
				</div>

				<form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
					<div className="flex items-center gap-3 rounded-xl border border-gray-6 bg-gray-3/50 px-4 py-3">
						<Avatar
							size="3"
							fallback={displayName.slice(0, 1)}
							color="blue"
						/>
						<div className="min-w-0">
							<Text size="1" color="gray" weight="medium">
								Applying as
							</Text>
							<Text size="2" weight="medium" className="truncate">
								{displayName}
							</Text>
							<Text size="2" color="gray" className="truncate">
								{displayHandle}
							</Text>
						</div>
					</div>

					<FormField
						label="Your pitch"
						id="apply-pitch"
						hint="Share relevant experience, your approach, and why you want this task."
					>
						<TextArea
							id="apply-pitch"
							name="pitch"
							value={pitch}
							onChange={(event) => setPitch(event.target.value)}
							placeholder="I've done similar work for… Here's how I'd tackle this…"
							rows={6}
							required
							minLength={PITCH_MIN}
							maxLength={PITCH_MAX}
							disabled={isSubmitting}
							className="min-h-[140px] resize-y"
							size="3"
							variant="surface"
						/>
						<div className="flex justify-end">
							<Text
								size="1"
								color={
									pitchLength > PITCH_MAX || (pitchLength > 0 && !pitchValid)
										? "red"
										: "gray"
								}
							>
								{pitchLength} / {PITCH_MAX}
								{pitchLength > 0 && pitchLength < PITCH_MIN
									? ` (${PITCH_MIN} minimum)`
									: ""}
							</Text>
						</div>
					</FormField>

					<FormField
						label="Portfolio or work link"
						id="apply-portfolioUrl"
						hint="Optional — portfolio, GitHub, Behance, or a relevant sample."
					>
						<TextField.Root size="3" variant="surface">
							<TextField.Input
								id="apply-portfolioUrl"
								name="portfolioUrl"
								type="url"
								placeholder="https://yoursite.com/work"
								disabled={isSubmitting}
							/>
						</TextField.Root>
					</FormField>

					{error ? (
						<Callout.Root color="red" variant="soft" size="1">
							<Callout.Text>{error}</Callout.Text>
						</Callout.Root>
					) : null}

					<Separator className="w-full" size="4" />

					<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<Dialog.Close>
							<Button
								type="button"
								size="3"
								variant="soft"
								color="gray"
								disabled={isSubmitting}
								className="w-full sm:w-auto"
							>
								Cancel
							</Button>
						</Dialog.Close>
						<Button
							type="submit"
							size="3"
							variant="solid"
							color="blue"
							disabled={isSubmitting || !pitchValid}
							className="w-full sm:w-auto"
						>
							{isSubmitting ? "Submitting…" : "Submit application"}
						</Button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	);
}
