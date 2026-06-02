"use client";

import { Button, Heading, Text } from "@whop/react/components";
import Link from "next/link";

export function DashboardHero() {
	return (
		<section className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[calc(100vh-7rem)] sm:py-24">
			<div className="flex max-w-3xl flex-col items-center gap-5 sm:gap-6">
				<Heading size="9" className="tracking-tight leading-[1.05]">
					Post work. Pick it up. Get paid on Whop.
				</Heading>
				<Text
					size="5"
					color="gray"
					className="max-w-2xl leading-relaxed text-gray-11"
				>
					Whop Tasks connects creators who need help with members who want
					to sell their skills — design, dev, marketing, and more.
				</Text>
			</div>

			<div className="mt-10 flex w-full max-w-md flex-col items-center gap-4 sm:mt-12">
				<Link href="/browse" className="w-full">
					<Button
						size="4"
						variant="solid"
						color="blue"
						className="h-14 w-full text-base sm:h-16 sm:text-lg"
					>
						Browse tasks
					</Button>
				</Link>
				<Link href="/tasks/new">
					<Button size="2" variant="ghost" color="gray">
						Post a task instead
					</Button>
				</Link>
			</div>
		</section>
	);
}
