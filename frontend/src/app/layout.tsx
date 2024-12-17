import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";

const inter = Inter({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Quit Udud",
	description: "A chatbot that helps you quit smoking",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute={`class`}>
					<main className="flex relative w-screen">
						<Sidebar />
						<div className="w-full h-screen flex items-center justify-center">
							{children}
						</div>
						<ThemeToggle className="absolute top-4 right-4" />
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
