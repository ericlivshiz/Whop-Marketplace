"use client";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Badge, Button, IconButton, Text } from "@whop/react/components";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PITCH_PREVIEW_LENGTH = 120;

function truncatePitch(pitch: string): string {
	if (pitch.length <= PITCH_PREVIEW_LENGTH) {
		return pitch;
	}
	return `${pitch.slice(0, PITCH_PREVIEW_LENGTH).trim()}…`;
}

function BellIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden
		>
			<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
			<path d="M13.73 21a2 2 0 0 1-3.46 0" />
		</svg>
	);
}

export function NotificationBell() {
	const router = useRouter();
	const notifications = useQuery(api.notifications.listForCurrentUser);
	const unreadCount = useQuery(api.notifications.unreadCount);
	const markRead = useMutation(api.notifications.markRead);
	const markAllRead = useMutation(api.notifications.markAllRead);
	const [open, setOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) {
			return;
		}

		function handleClickOutside(event: MouseEvent) {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);

	async function handleNotificationClick(
		notificationId: Id<"notifications">,
		taskId: Id<"tasks">,
		read: boolean,
	) {
		if (!read) {
			await markRead({ notificationId });
		}
		setOpen(false);
		router.push(`/tasks/${taskId}`);
	}

	const count = unreadCount ?? 0;

	return (
		<div className="relative" ref={panelRef}>
			<IconButton
				size="2"
				variant="ghost"
				color="gray"
				aria-label={
					count > 0
						? `Notifications, ${count} unread`
						: "Notifications"
				}
				aria-expanded={open}
				onClick={() => setOpen((value) => !value)}
			>
				<BellIcon />
			</IconButton>
			{count > 0 ? (
				<span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-blue-9 text-[10px] font-medium text-white">
					{count > 9 ? "9+" : count}
				</span>
			) : null}

			{open ? (
				<div className="absolute right-0 top-full z-30 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-xl border border-gray-6 bg-gray-2 shadow-lg">
					<div className="flex items-center justify-between border-b border-gray-6 px-4 py-3">
						<Text size="2" weight="medium">
							Notifications
						</Text>
						{count > 0 ? (
							<Button
								size="1"
								variant="ghost"
								color="gray"
								onClick={() => markAllRead({})}
							>
								Mark all read
							</Button>
						) : null}
					</div>

					<div className="max-h-[min(70vh,420px)] overflow-y-auto">
						{notifications === undefined ? (
							<Text size="2" color="gray" className="px-4 py-6 text-center">
								Loading…
							</Text>
						) : notifications.length === 0 ? (
							<Text size="2" color="gray" className="px-4 py-6 text-center">
								No notifications yet
							</Text>
						) : (
							<ul>
								{notifications.map((notification) => (
									<li key={notification.id}>
										<button
											type="button"
											className={`w-full border-b border-gray-6 px-4 py-3 text-left transition-colors hover:bg-gray-3 ${
												notification.read ? "opacity-80" : "bg-gray-3/50"
											}`}
											onClick={() =>
												handleNotificationClick(
													notification.id as Id<"notifications">,
													notification.taskId as Id<"tasks">,
													notification.read,
												)
											}
										>
											<div className="flex items-start justify-between gap-2">
												<Text size="2" weight="medium" className="line-clamp-2">
													{notification.type === "task_posted"
														? notification.message
														: `${notification.applicantName} applied`}
												</Text>
												{!notification.read ? (
													<Badge color="blue" variant="soft" size="1">
														New
													</Badge>
												) : null}
											</div>
											{notification.type === "task_posted" ? (
												<Text
													size="2"
													color="gray"
													className="mt-2 leading-relaxed"
												>
													Your listing is live. Members can browse and apply.
												</Text>
											) : (
												<>
													<Text
														size="1"
														color="gray"
														className="mt-0.5 line-clamp-1"
													>
														{notification.taskTitle}
													</Text>
													<Text
														size="2"
														color="gray"
														className="mt-2 line-clamp-3 leading-relaxed"
													>
														{truncatePitch(notification.pitch)}
													</Text>
													{notification.portfolioUrl ? (
														<Text size="1" color="blue" className="mt-1">
															Includes portfolio link
														</Text>
													) : null}
												</>
											)}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			) : null}
		</div>
	);
}
