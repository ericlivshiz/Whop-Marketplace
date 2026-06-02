"use client";

import { TaskCard } from "@/components/tasks/task-card";
import { TASK_CATEGORIES } from "@/lib/tasks/mock-data";
import type { TaskCategory } from "@/lib/tasks/types";
import { api } from "@convex/_generated/api";
import {
	Button,
	FilterChip,
	Heading,
	IconButton,
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

	const hasQuery = query.trim().length > 0;
	const resultCount = filteredTasks.length;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Heading size="6">Open tasks</Heading>
					<Text size="2" color="gray" className="mt-1">
						Find work that matches your skills.
					</Text>
				</div>
				<Link href="/tasks/new" className="shrink-0">
					<Button size="2" variant="soft" color="blue">
						Post a task
					</Button>
				</Link>
			</div>

			<div className="rounded-2xl border border-gray-6 bg-gray-2 p-4 sm:p-5">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<Text size="2" weight="medium">
							Search
						</Text>
						{tasks !== undefined ? (
							<Text size="1" color="gray">
								{resultCount === 1
									? "1 task"
									: `${resultCount} tasks`}
								{hasQuery || category !== "all" ? " matching" : " open"}
							</Text>
						) : null}
					</div>

					<TextField.Root
						size="3"
						variant="surface"
						className="w-full rounded-xl border-gray-6 bg-gray-1 shadow-sm transition-[box-shadow,border-color] focus-within:border-blue-7 focus-within:ring-2 focus-within:ring-blue-4"
					>
						<TextField.Slot className="pl-[7px] text-gray-9">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden
							>
								<circle cx="11" cy="11" r="7" />
								<path d="M20 20L17 17" />
							</svg>
						</TextField.Slot>
						<TextField.Input
							placeholder="Search by title, description, or seller…"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							className="placeholder:text-gray-9"
						/>
						{hasQuery ? (
							<TextField.Slot className="pr-1">
								<IconButton
									size="2"
									variant="ghost"
									color="gray"
									aria-label="Clear search"
									onClick={() => setQuery("")}
								>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										aria-hidden
									>
										<path d="M18 6L6 18M6 6l12 12" />
									</svg>
								</IconButton>
							</TextField.Slot>
						) : null}
					</TextField.Root>

					<div className="flex flex-col gap-2.5 border-t border-gray-6 pt-4">
						<Text size="1" color="gray" weight="medium" className="uppercase tracking-wide">
							Category
						</Text>
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
					</div>
				</div>
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
				<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{filteredTasks.map((task) => (
						<TaskCard key={task.id} task={task} />
					))}
				</div>
			)}
		</div>
	);
}
