import { cn } from "../../lib/utils.js";
// import { LucideIcon } from "lucide-react";

export function StatCard({
    title,
    value,
    change,
    icon: Icon,
    positive = true,
    colorClass = "bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-primary-400",
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {change && (
                        <p
                            className={cn(
                                "mt-1 text-sm",
                                positive ? "text-green-500" : "text-red-500"
                            )}
                        >
                            {positive ? (
                                <span className="inline-flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 01.707 1.707l-3 3a1 1 0 01-1.414-1.414L9.586 13H8a1 1 0 01-1-1V9a1 1 0 011-1h2V7a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {change}
                                </span>
                            ) : (
                                <span className="inline-flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 13a1 1 0 01-1 1H9v1h2a1 1 0 110 2H8a1 1 0 01-1-1v-4a1 1 0 011-1h2v-1H8a1 1 0 010-2h2v-1a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {change}
                                </span>
                            )}
                        </p>
                    )}
                </div>
                <div className={cn("p-2 rounded-lg", colorClass)}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
