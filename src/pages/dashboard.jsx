import { useState, useEffect } from "react";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { CategoryDistribution } from "@/components/dashboard/category-distribution.jsx";
import { Button } from "@/components/ui/button";
import { FileText, Tag, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getNews, getCategories } from "@/data.ts";

export default function Dashboard() {
  const [isError, setIsError] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const newsData = getNews();
      const categoryData = getCategories();

      setCategories(categoryData);

      // Calculate stats
      const totalArticles = newsData.length;
      const totalCategories = categoryData.length;
      const totalViews = newsData.reduce((acc, article) => acc + (article.viewCount || 0), 0);

      // Get recent articles
      const sortedArticles = [...newsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const recent = sortedArticles.slice(0, 5);
      setRecentArticles(recent);

      setStats({
        totalArticles,
        totalCategories,
        totalViews,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  // Prepare category distribution data
  const categoryDistribution = categories?.map((category) => {
    const count = stats?.categoryCount?.[category.id] || 0;
    const total = stats?.totalArticles || 1; // Avoid division by zero
    const percentage = Math.round((count / total) * 100);

    return {
      category,
      count,
      percentage
    };
  }) || [];

  return (
    <DashboardLayout title="Dashboard">
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There was an error loading dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Articles"
              value={stats?.totalArticles || 0}
              change={"0%"}
              icon={FileText}
              positive={true}
              colorClass="bg-blue-100 dark:bg-blue-900/30 text-primary-600 dark:text-primary-400"
            />

            <StatCard
              title="Total Categories"
              value={stats?.totalCategories || 0}
              change={"0 new"}
              icon={Tag}
              positive={true}
              colorClass="bg-orange-100 dark:bg-orange-900/30 text-secondary-500 dark:text-secondary-400"
            />

            <StatCard
              title="Total Views"
              value={stats?.totalViews || 0}
              change={"0%"}
              icon={Eye}
              positive={true}
              colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            />

            <StatCard
              title="User Engagement"
              value={"0%"}
              change={"0%"}
              icon={FileText}
              positive={true}
              colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Articles</h2>
                  <Link href="/admin/articles">
                    <a className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View All
                    </a>
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3">Title</th>
                        <th scope="col" className="px-4 py-3">Category</th>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentArticles?.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center">No articles found</td>
                        </tr>
                      ) : (
                        recentArticles?.map((article) => (
                          <tr key={article.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                              {article.title}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}>
                                {article.categoryId}
                              </span>
                            </td>
                            <td className="px-4 py-3">{formatDate(article.createdAt, 'MMM d, yyyy')}</td>
                            <td className="px-4 py-3">{article.viewCount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <CategoryDistribution data={categoryDistribution} />

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link href="/admin/articles">
                    <a className="w-full">
                      <Button className="w-full flex items-center justify-center gap-2">
                        <FileText className="h-4 w-4" /> Add New Article
                      </Button>
                    </a>
                  </Link>
                  <Link href="/admin/categories">
                    <a className="w-full">
                      <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                        <Tag className="h-4 w-4" /> Manage Categories
                      </Button>
                    </a>
                  </Link>
                  <Link href="/">
                    <a className="w-full">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" /> Preview Site
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
