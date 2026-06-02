import { Badge, Button, Card, Heading, Text } from "@whop/react/components";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-6">
			<Card size="3" variant="surface" className="w-full max-w-lg">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Badge color="blue" variant="soft">
							Frosted UI
						</Badge>
						<Heading size="6">Whop Design System</Heading>
						<Text size="3" color="gray">
							This Next.js app is wired up with Whop&apos;s Frosted UI — 60+
							accessible components, Radix color scales, typography tokens, and
							dark mode support.
						</Text>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button size="2" variant="solid" color="blue" asChild>
							<Link
								href="https://docs.whop.com/developer/guides/frosted_ui"
								target="_blank"
								rel="noopener noreferrer"
							>
								Frosted UI Docs
							</Link>
						</Button>
						<Button size="2" variant="soft" color="gray" asChild>
							<Link
								href="https://storybook.whop.dev"
								target="_blank"
								rel="noopener noreferrer"
							>
								Storybook
							</Link>
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
