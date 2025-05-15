import { Card, CardHeader, CardContent } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Edit, Trash2 } from "lucide-react";
import { formatDate, getCategoryIcon } from "../../lib/utils";

export function CategoryGrid({
    categories,
    onEdit,
    onDelete,
    articlesCount = {},
}) {
    // Get appropriate icon based on category name
    const getIcon = (category) => {
        if (category.icon) {
            return category.icon;
        }
        return getCategoryIcon(category.name);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
                <Card
                    key={category.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow"
                >
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <i
                                className={`${getIcon(category)} text-${category.color || "blue"
                                    }-500 text-xl mr-2`}
                            ></i>
                            <h3 className="font-medium">{category.name}</h3>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(category)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(category)}
                                className="text-destructive hover:text-destructive/90"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Articles
                            </span>
                            <span className="text-sm font-medium">
                                {articlesCount[category.id] || 0}
                            </span>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Last Updated
                            </span>
                            <span className="text-sm">
                                {formatDate(category.updatedAt || new Date(), "MMM d, yyyy")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Status
                            </span>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                                {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
