"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotMessageSquare, LoaderCircle, SendIcon } from "lucide-react";

interface UserInfo {
	smoking_frequency: number;
	craving_level: number;
	mood: string;
	reason_to_quit: string;
}

interface Message {
	type: "user" | "bot";
	text: string;
}

const QuitSmokingChatbot = () => {
	const [userInfo, setUserInfo] = useState<UserInfo>({
		smoking_frequency: 1,
		craving_level: 1,
		mood: "",
		reason_to_quit: "",
	});
	const [messages, setMessages] = useState<Message[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const [userInput, setUserInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [sending, setSending] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	const handleInfoSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/initialize`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userInfo),
			});
			setIsInitialized(true);
			setMessages([
				{
					type: "bot",
					text: "Welcome to Qudud! Your session is initialized. Type 'motivation' for motivation, 'craving' for tips, or type any message to interact.",
				},
			]);
			setLoading(false);
		} catch (error) {
			console.error("Error initializing session", error);
			setLoading(false);
		}
	};

	const handleSendMessage = async () => {
		if (!userInput.trim()) return;

		const newMessages: Message[] = [
			...messages,
			{ type: "user" as const, text: userInput },
		];
		setMessages(newMessages);
		setUserInput("");

		try {
			setSending(true);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/chat`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ message: userInput }),
				}
			);
			const data = await response.json();
			setMessages((prevMessages) => [
				...prevMessages,
				{ type: "bot", text: data.response },
			]);
			setSending(false);
		} catch (error) {
			setSending(false);
			console.error("Error sending message", error);
		}
	};

	return (
		<div className="sm:mx-auto sm:w-full">
			{!isInitialized ? (
				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-800 bg-inherit">
						<form onSubmit={handleInfoSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="smoking-frequency">
									Cigarettes per Day
								</Label>
								<Slider
									id="smoking-frequency"
									min={1}
									max={30}
									step={1}
									value={[userInfo.smoking_frequency]}
									onValueChange={(value) =>
										setUserInfo({
											...userInfo,
											smoking_frequency: value[0],
										})
									}
								/>
								<div className="text-sm text-gray-500">
									Value: {userInfo.smoking_frequency}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="craving-level">
									Craving Level (1-10)
								</Label>
								<Slider
									id="craving-level"
									min={1}
									max={10}
									step={1}
									value={[userInfo.craving_level]}
									onValueChange={(value) =>
										setUserInfo({
											...userInfo,
											craving_level: value[0],
										})
									}
								/>
								<div className="text-sm text-gray-500">
									Value: {userInfo.craving_level}
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="mood">Current Mood</Label>
								<Select
									value={userInfo.mood}
									onValueChange={(value) =>
										setUserInfo({
											...userInfo,
											mood: value,
										})
									}>
									<SelectTrigger id="mood">
										<SelectValue placeholder="Select your current mood" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="happy">
											Happy
										</SelectItem>
										<SelectItem value="stressed">
											Stressed
										</SelectItem>
										<SelectItem value="bored">
											Bored
										</SelectItem>
										<SelectItem value="anxious">
											Anxious
										</SelectItem>
										<SelectItem value="relaxed">
											Relaxed
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="reason-to-quit">
									Reason to Quit
								</Label>
								<Textarea
									id="reason-to-quit"
									placeholder="Enter your reason for quitting..."
									value={userInfo.reason_to_quit}
									onChange={(e) =>
										setUserInfo({
											...userInfo,
											reason_to_quit: e.target.value,
										})
									}
								/>
							</div>

							<Button
								type="submit"
								disabled={
									!Boolean(userInfo.reason_to_quit) ||
									!Boolean(userInfo.mood) ||
									loading
								}
								className="w-full">
								{loading ? (
									<>
										<LoaderCircle className="animate-spin" />
										Loading...
									</>
								) : (
									<>
										<BotMessageSquare />
										Start Chatbot
									</>
								)}
							</Button>
						</form>
					</div>
				</div>
			) : (
				<div className="flex flex-col h-screen pt-12 w-full">
					<ScrollArea className="flex-grow text-sm" ref={scrollAreaRef}>
						<div className="max-w-screen-md mx-auto p-4 space-y-6">
							{messages.map((msg, index) => (
								<div
									key={index}
									className={`flex ${
										msg.type === "user"
											? "justify-end ml-10"
											: "justify-start mr-10"
									}`}>
									<div
										className={`flex items-start space-x-3 ${
											msg.type === "user"
												? "flex-row-reverse space-x-reverse"
												: "flex-row"
										}`}>
										<Avatar className="w-8 h-8">
											{msg.type === "user" ? (
												<AvatarImage
													src="/placeholder.svg?height=32&width=32"
													alt="User"
												/>
											) : (
												<AvatarImage
													src="/sudais.jpg"
													alt="Bot"
												/>
											)}
											<AvatarFallback>
												{msg.type === "user"
													? "U"
													: "B"}
											</AvatarFallback>
										</Avatar>
										<div
											className={`py-1 ${
												msg.type === "user"
													? "bg-neutral-800 px-3 grid place-items-center rounded-full text-white"
													: "bg-muted text-muted-foreground"
											}`}>
											{msg.text}
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
					<footer className="p-4">
						<div className="max-w-screen-md mx-auto">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSendMessage();
								}}
								className="flex w-full space-x-2">
								<Input
									type="text"
									value={userInput}
									onChange={(e) =>
										setUserInput(e.target.value)
									}
									placeholder="Message Qudud"
									className="flex-grow bg-background text-foreground"
								/>
								<Button
									type="submit"
									disabled={sending}
									size="icon">
									{sending ? (
										<LoaderCircle className="animate-spin" />
									) : (
										<>
											<SendIcon className="h-4 w-4" />
											<span className="sr-only">
												Send
											</span>
										</>
									)}
								</Button>
							</form>
							<p className="text-center text-xs text-neutral-500 mt-2">
								Qudud can make mistakes. Please use with
								discretion.
							</p>
						</div>
					</footer>
				</div>
			)}
		</div>
	);
};

export default QuitSmokingChatbot;
