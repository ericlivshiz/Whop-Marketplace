import { DashboardHero } from "@/components/tasks/dashboard-hero";
import { AppShell } from "@/components/tasks/app-shell";

export default function DashboardPage() {
	return (
		<AppShell>
			<DashboardHero />
		</AppShell>
	);
}
