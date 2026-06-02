import { ConvexClientProvider } from "@/components/convex-client-provider";
import { FrostedProviders } from "@/components/frosted-providers";
import { getToken } from "@/lib/auth-server";
import { WhopThemeScript } from "@whop/react/theme";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Whop Tasks",
	description: "Post tasks, find work, and get paid in the Whop ecosystem",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const token = await getToken();

	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full">
				<WhopThemeScript />
				<ConvexClientProvider initialToken={token}>
					<FrostedProviders>{children}</FrostedProviders>
				</ConvexClientProvider>
			</body>
		</html>
	);
}
