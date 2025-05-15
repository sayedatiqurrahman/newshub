import { useState } from "react";
import { Sidebar } from "./sidebar.jsx";
import { Navbar } from "./navbar.jsx";

export function DashboardLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar title={title} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-10 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="p-4 lg:ml-64 pt-20 min-h-screen overflow-auto">
                {children}
            </main>
        </div>
    );
}
