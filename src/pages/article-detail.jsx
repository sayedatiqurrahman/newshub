import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { formatDate, getCategoryColor } from "..//lib/utils";
import { Button } from "../components/ui/button";
import { NewspaperIcon, ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { ThemeToggle } from "../components/ui/theme-toggle.jsx";
import { cn } from "../lib/utils";
import { apiRequest } from "../lib/queryClient";

export default function ArticleDetail() {
    const [, params] = useRoute("/article/:slug");
    const slug = params?.slug;

    // Update article view count on visit
    useEffect(() => {
        if (slug) {
            const updateViewCount = async () => {
                try {
                    await apiRequest("POST", `/api/articles/${slug}/view`, null);
                } catch (error) {
                    console.error("Failed to update view count:", error);
                }
            };

            updateViewCount();
        }
    }, [slug]);

    // Fetch article data
    const { data: article, isLoading: isLoadingArticle } = useQuery({
        queryKey: [`/api/articles/${slug}`],
        enabled: !!slug,
    });

    // Fetch categories
    const { data: categories = [] } = useQuery({
        queryKey: ["/api/categories"],
    });

    // Fetch related articles
    const { data: relatedArticles = [] } = useQuery({
        queryKey: [`/api/articles/related/${slug}`],
        enabled: !!slug && !!article?.categoryId,
    });

    // Find category for the article
    const category = categories.find((c) => c.id === article?.categoryId);

    if (isLoadingArticle) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="loader h-12 w-12 rounded-full border-4 border-gray-200"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <NewspaperIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The article you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/">
                        <a>
                            <Button className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Button>
                        </a>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-primary-600 dark:bg-primary-800 p-3 flex justify-between items-center">
                <Link href="/">
                    <a className="flex items-center">
                        <NewspaperIcon className="h-6 w-6 text-white mr-2" />
                        <span className="font-bold text-white text-lg">NewsHub</span>
                    </a>
                </Link>
                <div className="flex items-center">
                    <ThemeToggle />
                    <Link href="/admin">
                        <a className="hidden md:block ml-2 px-4 py-1 text-white bg-white/20 hover:bg-white/30 rounded text-sm">
                            Admin
                        </a>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Back to Home */}
                <div className="mb-6">
                    <Link href="/">
                        <a className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to All Articles
                        </a>
                    </Link>
                </div>

                {/* Article Header */}
                <div className="mb-8">
                    {category && (
                        <Link href={`/?category=${category.slug}`}>
                            <a
                                className="inline-block text-xs font-medium px-2 py-1 rounded mb-4 category-${category.slug}"
                            >
                                {category.name}
                            </a>
                        </Link>
                    )}

                    {article.isBreakingNews && (
                        <span className="inline-block bg-red-600 text-white px-2 py-1 text-xs font-medium rounded ml-2 mb-4">
                            Breaking News
                        </span>
                    )}

                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm mb-6 gap-4">
                        {article.author && (
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                <span>{article.author}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(article.createdAt || new Date(), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{article.viewCount} views</span>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {article.imageUrl && (
                    <div className="mb-8">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    {article.summary && (
                        <div className="mb-6 font-medium text-lg text-gray-700 dark:text-gray-300 border-l-4 border-primary-500 pl-4 italic">
                            {article.summary}
                        </div>
                    )}

                    <div
                        className="news-content prose dark:prose-invert lg:prose-lg max-w-none"
                        dangerouslySetInnerHTML={{
                            __html: article.content.replace(/\n/g, "<br />"),
                        }}
                    />
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedArticles.map((relArticle) => (
                                <div
                                    key={relArticle.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    <Link href={`/article/${relArticle.slug}`}>
                                        <a>
                                            {relArticle.imageUrl && (
                                                <img
                                                    src={relArticle.imageUrl}
                                                    alt={relArticle.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}
                                        </a>
                                    </Link>
                                    <div className="p-4">
                                        <Link href={`/article/${relArticle.slug}`}>
                                            <a className="block">
                                                <h3 className="text-lg font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                                    {relArticle.title}
                                                </h3>
                                            </a>
                                        </Link>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                            {relArticle.summary &&
                                                relArticle.summary.substring(0, 100)}
                                            {relArticle.summary && relArticle.summary.length > 100
                                                ? "..."
                                                : ""}
                                        </p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {formatDate(
                                                    relArticle.createdAt || new Date(),
                                                    "MMM d, yyyy"
                                                )}
                                            </span>
                                            <Link href={`/article/${relArticle.slug}`}>
                                                <a className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                                                    Read More
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <NewspaperIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                        <span className="font-bold text-xl">NewsHub</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} NewsHub. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
