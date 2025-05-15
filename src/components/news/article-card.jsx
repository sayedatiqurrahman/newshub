import { Link } from "wouter";
import { timeAgo, truncateText, getCategoryColor } from "../../lib/utils";
import { cn } from "../../lib/utils";

export function ArticleCard({
    article,
    category,
    variant = "default",
}) {
    const isFeatured = variant === "featured";

    // Default image if none is provided
    const imageUrl =
        article.imageUrl ||
        "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500";

    // Format date
    const timeAgoText = timeAgo(article.createdAt || new Date());

    // Get category styles
    const categoryStyle = category
        ? "category-" + category.slug
        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg",
                isFeatured && "md:col-span-2 lg:col-span-3"
            )}
        >
            <Link href={`/article/${article.slug}`}>
                <a className="block">
                    <div className={cn("relative", isFeatured ? "h-96" : "h-48")}>
                        <img
                            src={imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        {article.isBreakingNews && (
                            <span className="absolute top-4 left-4 text-white bg-red-600 px-2 py-1 text-xs font-medium rounded">
                                Breaking News
                            </span>
                        )}
                    </div>
                </a>
            </Link>

            <div className="p-4">
                <div className="flex items-center mb-2">
                    {category && (
                        <span
                            className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded",
                                categoryStyle
                            )}
                        >
                            {category.name}
                        </span>
                    )}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {timeAgoText}
                    </span>
                </div>

                <Link href={`/article/${article.slug}`}>
                    <a className="block">
                        <h3 className="text-lg font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {article.title}
                        </h3>
                    </a>
                </Link>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {truncateText(article.summary || "", isFeatured ? 200 : 100)}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {article.author ? `By ${article.author}` : ""}
                    </span>
                    <Link href={`/article/${article.slug}`}>
                        <a className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium">
                            Read More
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
