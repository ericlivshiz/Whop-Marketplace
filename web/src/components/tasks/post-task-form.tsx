"use client";

import { AppShell } from "@/components/tasks/app-shell";
import { TASK_CATEGORIES } from "@/lib/tasks/mock-data";
import type { TaskCategory } from "@/lib/tasks/types";
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
import Link from "next/link";
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

export function PostTaskForm() {
	const [submitted, setSubmitted] = useState(false);
	const [category, setCategory] = useState<TaskCategory>("design");

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitted(true);
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

				{submitted ? (
					<Callout.Root color="green" variant="soft">
						<Callout.Text>
							Task saved locally for preview — backend coming soon.
						</Callout.Text>
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
								/>
							</TextField.Root>
						</FormField>

						<div className="flex flex-wrap gap-2 pt-2">
							<Button type="submit" size="2" variant="solid" color="blue">
								Publish task
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
