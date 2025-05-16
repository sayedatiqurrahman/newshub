import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { CustomToaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import NotFound from "./pages/not-found.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Articles from "./pages/articles.jsx";
import ArticleDetail from "./pages/article-detail.jsx";
import { useEffect } from "react";
import { NewsProvider } from "./context/news-context";
import NewsSite from "./pages/News-site.jsx";
import Categories from "./pages/Categories.jsx";
import { initializeLocalStorage } from "./data.ts";

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/articles" component={Articles} />
      <Route path="/articles" component={Articles} />
      <Route path="/admin/categories" component={Categories} />
      <Route path="/categories" component={Categories} />

      {/* Public Routes */}
      <Route path="/" component={NewsSite} />
      <Route path="/article/:slug" component={ArticleDetail} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomToaster />
        <NewsProvider>
          <Router />
        </NewsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
