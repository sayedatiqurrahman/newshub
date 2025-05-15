import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.jsx";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Articles from "./pages/articles.jsx";
import Categories from "./pages/categories.jsx";
import NewsSite from "./pages/news-site.jsx";
import ArticleDetail from "./pages/article-detail.jsx";
import { useEffect } from "react";
import { initializeLocalStorage } from "./data";

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/articles" component={Articles} />
      <Route path="/admin/categories" component={Categories} />

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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
