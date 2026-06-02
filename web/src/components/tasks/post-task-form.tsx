"use client";

import { AppShell } from "@/components/tasks/app-shell";
import { TASK_CATEGORIES } from "@/lib/tasks/mock-data";
import type { TaskCategory } from "@/lib/tasks/types";
import { api } from "@convex/_generated/api";
import {
	Button,
	Callout,
	Card,
	Heading,
	Select,
	Text,
	TextArea,
	TextField,
} from "@whop/react/components";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

function FormField({
	label,
	id,
	children,
}: {
	label: string;
	id: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Text as="label" htmlFor={id} size="2" weight="medium">
				{label}
			</Text>
			{children}
		</div>
	);
}

function parseDeadlineMs(dateValue: string): number {
	const [year, month, day] = dateValue.split("-").map(Number);
	return new Date(year, month - 1, day).getTime();
}

export function PostTaskForm() {
	const router = useRouter();
	const createTask = useMutation(api.tasks.create);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [category, setCategory] = useState<TaskCategory>("design");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get("title") ?? "");
		const description = String(formData.get("description") ?? "");
		const budget = Number(formData.get("budget"));
		const deadlineValue = String(formData.get("deadline") ?? "");

		try {
			const taskId = await createTask({
				title,
				description,
				category,
				budget,
				deadline: parseDeadlineMs(deadlineValue),
			});
			router.push(`/tasks/${taskId}`);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to publish task",
			);
			setIsSubmitting(false);
		}
	}

	const categoryOptions = TASK_CATEGORIES.filter(
		(item) => item.value !== "all",
	);

	return (
		<AppShell>
			<div className="mx-auto flex max-w-xl flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Heading size="6">Post a task</Heading>
					<Text size="3" color="gray">
						Describe what you need done. Buyers on Whop Tasks can apply
						when you wire up payments.
					</Text>
				</div>

				{error ? (
					<Callout.Root color="red" variant="soft">
						<Callout.Text>{error}</Callout.Text>
					</Callout.Root>
				) : null}

				<Card size="3" variant="surface">
					<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
						<FormField label="Title" id="task-title">
							<TextField.Root size="2" variant="surface">
								<TextField.Input
									id="task-title"
									name="title"
									placeholder="e.g. Design launch graphics"
									required
									disabled={isSubmitting}
								/>
							</TextField.Root>
						</FormField>

						<FormField label="Description" id="task-description">
							<TextArea
								id="task-description"
								name="description"
								size="2"
								variant="surface"
								placeholder="Scope, deliverables, and any links…"
								rows={5}
								required
								disabled={isSubmitting}
							/>
						</FormField>

						<div className="grid gap-4 sm:grid-cols-2">
							<FormField label="Category" id="task-category">
								<Select.Root
									size="2"
									value={category}
									onValueChange={(value) =>
										setCategory(value as TaskCategory)
									}
									disabled={isSubmitting}
								>
									<Select.Trigger id="task-category" variant="surface" />
									<Select.Content>
										{categoryOptions.map((item) => (
											<Select.Item key={item.value} value={item.value}>
												{item.label}
											</Select.Item>
										))}
									</Select.Content>
								</Select.Root>
							</FormField>

							<FormField label="Budget (USD)" id="task-budget">
								<TextField.Root size="2" variant="surface">
									<TextField.Slot>
										<Text size="2" color="gray">
											$
										</Text>
									</TextField.Slot>
									<TextField.Input
										id="task-budget"
										name="budget"
										type="number"
										min={1}
										placeholder="250"
										required
										disabled={isSubmitting}
									/>
								</TextField.Root>
							</FormField>
						</div>

						<FormField label="Deadline" id="task-deadline">
							<TextField.Root size="2" variant="surface">
								<TextField.Input
									id="task-deadline"
									name="deadline"
									type="date"
									required
									disabled={isSubmitting}
								/>
							</TextField.Root>
						</FormField>

						<div className="flex flex-wrap gap-2 pt-2">
							<Button
								type="submit"
								size="2"
								variant="solid"
								color="blue"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Publishing…" : "Publish task"}
							</Button>
							<Link href="/dashboard">
								<Button type="button" size="2" variant="soft" color="gray">
									Cancel
								</Button>
							</Link>
						</div>
					</form>
				</Card>
			</div>
		</AppShell>
	);
}
