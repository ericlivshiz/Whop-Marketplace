"use client";

import { TaskCard } from "@/components/tasks/task-card";
import { TASK_CATEGORIES } from "@/lib/tasks/mock-data";
import type { TaskCategory } from "@/lib/tasks/types";
import { api } from "@convex/_generated/api";
import {
	Badge,
	Button,
	FilterChip,
	Heading,
	Spinner,
	Text,
	TextField,
} from "@whop/react/components";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useMemo, useState } from "react";

export function BrowseMarketplace() {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<TaskCategory | "all">("all");
	const tasks = useQuery(api.tasks.listOpen);

	const filteredTasks = useMemo(() => {
		if (!tasks) {
			return [];
		}

		const normalizedQuery = query.trim().toLowerCase();

		return tasks.filter((task) => {
			const matchesCategory =
				category === "all" || task.category === category;
			const matchesQuery =
				normalizedQuery.length === 0 ||
				task.title.toLowerCase().includes(normalizedQuery) ||
				task.description.toLowerCase().includes(normalizedQuery) ||
				task.seller.name.toLowerCase().includes(normalizedQuery);

			return matchesCategory && matchesQuery;
		});
	}, [category, query, tasks]);

	return (
		<div className="flex flex-col gap-8">
			<section className="relative overflow-hidden rounded-2xl border border-blue-6 bg-gradient-to-br from-blue-2 via-gray-2 to-gray-3 p-6 sm:p-8">
				<div className="relative z-10 flex max-w-xl flex-col gap-4">
					<Badge color="blue" variant="soft" className="w-fit">
						Two-sided marketplace
					</Badge>
					<Heading size="7">
						Post work. Pick it up. Get paid on Whop.
					</Heading>
					<Text size="3" color="gray">
						Whop Tasks connects creators who need help with members who
						want to sell their skills — design, dev, marketing, and more.
					</Text>
					<div className="flex flex-wrap gap-2 pt-1">
						<Link href="/tasks/new">
							<Button size="2" variant="solid" color="blue">
								Post a task
							</Button>
						</Link>
						<Button size="2" variant="soft" color="gray" disabled>
							How it works
						</Button>
					</div>
				</div>
				<div
					className="pointer-events-none absolute -right-8 -top-8 size-48 rounded-full bg-blue-4 opacity-60 blur-3xl"
					aria-hidden
				/>
			</section>

			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Heading size="5">Open tasks</Heading>
					<TextField.Root size="2" variant="surface" className="w-full sm:max-w-xs">
						<TextField.Slot>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="text-gray-9"
								aria-hidden
							>
								<circle cx="11" cy="11" r="7" />
								<path d="M20 20L17 17" />
							</svg>
						</TextField.Slot>
						<TextField.Input
							placeholder="Search tasks…"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
						/>
					</TextField.Root>
				</div>

				<div className="flex flex-wrap gap-2">
					{TASK_CATEGORIES.map((item) => (
						<FilterChip
							key={item.value}
							checked={category === item.value}
							onCheckedChange={() => setCategory(item.value)}
						>
							{item.label}
						</FilterChip>
					))}
				</div>

				{tasks === undefined ? (
					<div className="flex justify-center py-12">
						<Spinner size="3" />
					</div>
				) : filteredTasks.length === 0 ? (
					<div className="rounded-xl border border-dashed border-gray-6 bg-gray-2 px-6 py-12 text-center">
						<Heading size="4">No tasks match</Heading>
						<Text size="2" color="gray" className="mt-2">
							Try a different search or category, or post your own task.
						</Text>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filteredTasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
