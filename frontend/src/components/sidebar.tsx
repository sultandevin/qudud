import Link from "next/link";
import {
	CigaretteOff,
	MessageSquare,
	Settings,
	User,
	Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
	{ icon: MessageSquare, label: "Chat", href: "/" },
	{
		icon: Flag,
		label: "Feedback",
		href: "/feedback",
	},
];

const Sidebar = () => {
	return (
		<div className="hidden sm:flex flex-col gap-4 h-screen w-64 bg-inherit border-r p-2 border-neutral-300 dark:border-neutral-800">
			<div className="p-2 flex justify-between gap-2 items-center">
				<CigaretteOff className="w-6 h-6" />
			</div>
			<Button
				variant={`secondary`}
				className="w-full">
					New Chat
			</Button>
			<nav className="flex-1">
				<ul className="space-y-2">
					{navItems.map((item, index) => (
						<li key={index}>
							<Link href={item.href} passHref>
								<Button
									variant="ghost"
									className="w-full justify-start text-left rounded-lg font-normal px-2">
									<item.icon className="mr-0.5 h-4 w-4" />
									{item.label}
								</Button>
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="w-full px-4 justify-start">
						<Avatar className="w-6 h-6 mr-2">
							<AvatarImage
								src="/placeholder-avatar.jpg"
								alt="User"
							/>
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
						<span>John Doe</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">
								John Doe
							</p>
							<p className="text-xs leading-none text-muted-foreground">
								john@example.com
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Log out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default Sidebar;
