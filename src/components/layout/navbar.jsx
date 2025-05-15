import { Link } from "wouter";
import { ThemeToggle } from "../../components/ui/theme-toggle.jsx";
import { NewspaperIcon, Menu } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar.jsx";
import { Button } from "../../components/ui/button.jsx";

export function Navbar({ title, sidebarOpen, setSidebarOpen }) {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30 shadow-sm">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 mr-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                        <Link href="/admin">
                            <a className="flex items-center">
                                <NewspaperIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                                <span className="self-center text-xl font-semibold whitespace-nowrap">
                                    NewsHub
                                </span>
                            </a>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <ThemeToggle />
                        <div className="flex items-center ml-3">
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-1 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
                                            alt="User"
                                        />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
