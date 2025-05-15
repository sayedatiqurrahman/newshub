import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
import {
    LayoutDashboard,
    FileText,
    Tag,
    Eye,
    Settings,
    LogOut,
} from "lucide-react";

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const [location] = useLocation();

    const isActive = (path) => {
        return location === path;
    };

    const menuItems = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            href: "/admin",
            active: isActive("/admin"),
        },
        {
            label: "Articles",
            icon: <FileText className="h-5 w-5" />,
            href: "/admin/articles",
            active: isActive("/admin/articles"),
        },
        {
            label: "Categories",
            icon: <Tag className="h-5 w-5" />,
            href: "/admin/categories",
            active: isActive("/admin/categories"),
        },
        {
            label: "Preview Site",
            icon: <Eye className="h-5 w-5" />,
            href: "/",
            active: false,
        },
        {
            label: "Settings",
            icon: <Settings className="h-5 w-5" />,
            href: "#",
            active: false,
        },
    ];

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-20 w-64 h-full pt-16 shadow-md bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
        >
            <div className="h-full px-3 pb-4 overflow-y-auto">
                <ul className="space-y-2 font-medium">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                                <a
                                    className={cn(
                                        "flex items-center p-2 rounded-lg group transition-colors",
                                        item.active
                                            ? "bg-gray-100 dark:bg-gray-700"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors",
                                            item.active && "text-gray-900 dark:text-white"
                                        )}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="ml-3">{item.label}</span>
                                </a>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                                <LogOut className="h-5 w-5" />
                            </span>
                            <span className="ml-3">Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
