"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
	Avatar,
	Card,
	Heading,
	Spinner,
	Text,
} from "@whop/react/components";
import { useQuery } from "convex/react";

function formatAppliedAt(createdAt: number): string {
	return new Date(createdAt).toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function TaskApplicationsPanel({ taskId }: { taskId: Id<"tasks"> }) {
	const applications = useQuery(api.applications.listForTask, { taskId });

	if (applications === undefined) {
		return (
			<Card size="3" variant="surface" className="flex justify-center py-8">
				<Spinner size="2" />
			</Card>
		);
	}

	return (
		<Card size="3" variant="surface">
			<Heading size="4" className="mb-1">
				Applications
			</Heading>
			<Text size="2" color="gray" className="mb-4">
				{applications.length === 0
					? "No applications yet. You'll be notified when someone applies."
					: `${applications.length} pending application${applications.length === 1 ? "" : "s"}`}
			</Text>

			{applications.length === 0 ? null : (
				<ul className="flex flex-col gap-4">
					{applications.map((application) => (
						<li
							key={application.id}
							className="rounded-xl border border-gray-6 bg-gray-2 p-4"
						>
							<div className="flex items-start gap-3">
								<Avatar
									size="3"
									fallback={application.applicantName.slice(0, 1)}
									color="blue"
								/>
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<Text size="2" weight="medium">
											{application.applicantName}
										</Text>
										<Text size="1" color="gray">
											{formatAppliedAt(application.createdAt)}
										</Text>
									</div>
									<Text size="2" color="gray" className="truncate">
										{application.applicantHandle}
									</Text>
									<Text
										size="2"
										className="mt-3 leading-relaxed whitespace-pre-wrap"
									>
										{application.pitch}
									</Text>
									{application.portfolioUrl ? (
										<a
											href={application.portfolioUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="mt-2 inline-block text-sm text-blue-11 hover:underline"
										>
											View portfolio / work link
										</a>
									) : null}
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
