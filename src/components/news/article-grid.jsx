import { useState, useEffect } from "react";
import { ArticleCard } from "./article-card.jsx";
import { useInfiniteScroll } from "../../hooks/use-infinite-scroll.js";
import { Button } from "../../components/ui/button.jsx";
import { Loader2 } from "lucide-react";

export function ArticleGrid({
    articles,
    categories,
    isLoading,
    hasMore,
    fetchMoreArticles,
    activeCategory = "all",
    sortBy = "newest",
}) {
    const [filteredArticles, setFilteredArticles] = useState([]);

    // Reference for infinite scroll
    const [ref] = useInfiniteScroll({
        loading: isLoading,
        hasMore,
        onLoadMore: fetchMoreArticles,
        rootMargin: "0px 0px 200px 0px",
    });

    // Filter and sort articles when dependencies change
    useEffect(() => {
        let filtered = [...articles];

        // Filter by category
        if (activeCategory !== "all") {
            const categoryId = categories.find((c) => c.slug === activeCategory)?.id;
            if (categoryId) {
                filtered = filtered.filter(
                    (article) => article.categoryId === categoryId
                );
            }
        }

        // Sort articles
        switch (sortBy) {
            case "newest":
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt || new Date()).getTime() -
                        new Date(a.createdAt || new Date()).getTime()
                );
                break;
            case "oldest":
                filtered.sort(
                    (a, b) =>
                        new Date(a.createdAt || new Date()).getTime() -
                        new Date(b.createdAt || new Date()).getTime()
                );
                break;
            case "popular":
                filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                break;
            case "alphabetical":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                filtered.sort(
                    (a, b) =>
                        new Date(b.createdAt || new Date()).getTime() -
                        new Date(a.createdAt || new Date()).getTime()
                );
        }

        setFilteredArticles(filtered);
    }, [articles, categories, activeCategory, sortBy]);

    if (isLoading && articles.length === 0) {
        return (
            <div className="flex justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (filteredArticles.length === 0 && !isLoading) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No articles found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try changing your filters or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="news-grid">
                {filteredArticles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        category={categories.find((c) => c.id === article.categoryId)}
                    />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center mt-6">
                    {isLoading ? (
                        <Button disabled className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading more articles...
                        </Button>
                    ) : (
                        <Button
                            onClick={fetchMoreArticles}
                            className="flex items-center gap-2"
                        >
                            Load More Articles
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
