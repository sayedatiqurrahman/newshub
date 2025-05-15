import { Progress } from "../../components/ui/progress.jsx";

export function CategoryDistribution({ data }) {
    // Define some colors for different categories
    const categoryColors = [
        "bg-blue-600",
        "bg-green-600",
        "bg-yellow-500",
        "bg-purple-600",
        "bg-red-600",
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={item.category.id}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.category.name}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.percentage}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div
                                className={`${categoryColors[index % categoryColors.length]
                                    } h-2 rounded-full`}
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
