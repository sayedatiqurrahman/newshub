import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { ArticleGrid } from "../components/news/article-grid";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { NewspaperIcon, Search, ArrowDown } from "lucide-react";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.jsx";

export default function NewsSite() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allArticles, setAllArticles] = useState([]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      const initialNews = localStorage.getItem("categories") || [
        {
          id: "1",
          title: "Technology News",
          categoryId: "technology",
          content: "This is a technology news article.",
        },
        {
          id: "2",
          title: "Political News",
          categoryId: "political",
          content: "This is a political news article.",
        },
        {
          id: "3",
          title: "Business News",
          categoryId: "business",
          content: "This is a business news article.",
        },
        {
          id: "4",
          title: "War News",
          categoryId: "war",
          content: "This is a war news article.",
        },
        {
          id: "5",
          title: "Breaking: Local Cat Saves Owner from Burning Building",
          categoryId: "technology",
          content:
            "In a heartwarming turn of events, a local cat named Mittens has been hailed a hero after saving its owner from a burning building. The fire, believed to have been started by a faulty toaster, quickly engulfed the kitchen of the Smith residence on Elm Street early this morning. Mittens, sensing the danger, repeatedly jumped on Mr. Smith's face, waking him up just in time to escape the blaze. Firefighters arrived shortly after and were able to contain the fire before it spread to neighboring homes. Mr. Smith was treated for smoke inhalation but is otherwise unharmed, thanks to the quick thinking and bravery of his feline companion. Mittens has been awarded the Key to the City and is enjoying a well-deserved nap.",
        },
        {
          id: "6",
          title: "Scientists Discover New Planet Habitable for Humans",
          categoryId: "technology",
          content:
            "In a groundbreaking discovery, scientists have announced the discovery of a new planet that is potentially habitable for humans. The planet, named Kepler-186f, is located in the habitable zone of its star, meaning that it could have liquid water on its surface. This discovery could have major implications for the future of humanity, as it could provide a new home for humans if Earth becomes uninhabitable.",
        },
      ];
      return JSON.parse(initialNews || "[]");
    },
  });
  console.log("🚀 ~ NewsSite ~ categories:", categories)

  const {
    data: articlesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["articles", page, activeCategory, sortBy],
    queryFn: () => {
      console.log("localStorage.getItem(\"news\")", localStorage.getItem("news"));
      let articles = JSON.parse(localStorage.getItem("news") || "[]");

      // Filter by category
      if (activeCategory !== "all") {
        articles = articles.filter((article) => article.categoryId === activeCategory);
      }

      // Sort articles
      if (sortBy === "newest") {
        articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "oldest") {
        articles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedArticles = articles.slice(start, end);

      return {
        articles: paginatedArticles,
        hasMore: end < articles.length,
      };
    },
  });
  console.log("🚀 ~ NewsSite ~ articlesData:", articlesData)

  // Update articles when data is fetched
  useEffect(() => {
    if (articlesData) {
      if (page === 1) {
        setAllArticles(articlesData.articles);
      } else {
        setAllArticles((prev) => [...prev, ...articlesData.articles]);
      }
      setHasMore(articlesData.hasMore);
    }
  }, [articlesData, page]);

  // Reset page when category or sort changes
  useEffect(() => {
    setPage(1);
    setAllArticles([]);
  }, [activeCategory, sortBy]);

  // Load more articles
  const loadMoreArticles = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };




  // Get featured article
  const featuredArticle =
    allArticles.find((article) => article.isFeatured) || allArticles[0];

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
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <a className="text-white hover:text-gray-200">Home</a>
          </Link>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.id} href={`/?category=${category.id}`}>
              <a className="text-white hover:text-gray-200">{category.name}</a>
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <ThemeToggle />
          <Button {...{ variant: "ghost", size: "icon" }} className="text-white" >
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/admin">
            <a className="hidden md:block ml-2 px-4 py-1 text-white bg-white/20 hover:bg-white/30 rounded text-sm">
              Admin
            </a>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <img
              src={
                featuredArticle.imageUrl ||
                "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=500"
              }
              alt={featuredArticle.title}
              className="w-full h-80 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              {featuredArticle.isBreakingNews && (
                <span className="text-white bg-red-600 px-2 py-1 text-sm font-medium rounded mb-2 inline-block">
                  Breaking News
                </span>
              )}
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                {featuredArticle.title}
              </h1>
              <p className="text-gray-200 mb-4 hidden md:block">
                {featuredArticle.summary}
              </p>
              <div className="flex items-center text-gray-300 text-sm">
                <span>
                  {featuredArticle.author ? `By ${featuredArticle.author}` : ""}
                </span>
                {featuredArticle.author && <span className="mx-2">•</span>}
                <span>
                  {new Date(featuredArticle.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* News Categories */}
        <div className="flex space-x-2 overflow-x-auto mb-6 pb-2">
          <Button
            {...(activeCategory === "all" ? { variant: "default" } : { variant: "outline" })}
            className="whitespace-nowrap rounded-full"
            onClick={() => setActiveCategory("all")}
          >
            All News
          </Button>
          {categories.slice(0, 5).map((category) => (
            <Button
              key={category.id}
              {...(activeCategory === category.id ? { variant: "default" } : { variant: "outline" })}
              className="whitespace-nowrap rounded-full"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {allArticles.length > 0
              ? `Showing ${allArticles.length} articles`
              : "No articles found"}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sort by:
            </span>
            <Select
              defaultValue="newest"
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles Grid */}
        <ArticleGrid
          articles={allArticles}
          categories={categories}
          isLoading={isLoading || isFetching}
          hasMore={hasMore}
          fetchMoreArticles={loadMoreArticles}
          activeCategory={activeCategory}
          sortBy={sortBy}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <NewspaperIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                <span className="font-bold text-xl">NewsHub</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Delivering the latest news and insights across technology,
                politics, finance, lifestyle, and more.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={`/?category=${category.slug}`}>
                      <a className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{category.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm">
                    Advertise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Subscribe
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Get the latest news delivered to your inbox.
              </p>
              <form className="space-y-2">
                <Input {...{ type: "email", placeholder: "Your email address" }} />
                <Button type="submit" {...{ className: "w-full" }}>
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} NewsHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
