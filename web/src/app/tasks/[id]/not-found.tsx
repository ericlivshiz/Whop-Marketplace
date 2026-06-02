import { AppShell } from "@/components/tasks/app-shell";
import { Button, Heading, Text } from "@whop/react/components";
import Link from "next/link";

export default function TaskNotFound() {
	return (
		<AppShell>
			<div className="flex flex-col items-center gap-4 py-16 text-center">
				<Heading size="6">Task not found</Heading>
				<Text size="3" color="gray">
					This task may have been removed or the link is incorrect.
				</Text>
				<Link href="/dashboard">
					<Button size="2" variant="solid" color="blue">
						Back to tasks
					</Button>
				</Link>
			</div>
		</AppShell>
	);
}
