import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "../components/layout/dashboard-layout";
import { ArticleForm } from "../components/news/article-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { apiRequest } from "../lib/queryClient";
import { z } from "zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { formatDate } from "../lib/utils";
import { useToast } from "../hooks/use-toast.js";
import {
    Edit,
    Trash2,
    Eye,
    Filter,
    Search,
    Plus,
    ChevronDown,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";

export default function Articles() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // State for dialogs
    const [showAddArticleModal, setShowAddArticleModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    // Fetch articles
    const { data, isLoading: isLoadingArticles } = useQuery({
        queryKey: ["/api/articles"],
    });

    // Extract articles array from response
    const articles = data?.articles || [];

    // Fetch categories
    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ["/api/categories"],
    });

    // Create article mutation
    const createArticleMutation = useMutation({
        mutationFn: async (data) => {
            const formData = new FormData();

            // Append all text fields
            Object.entries(data).forEach(([key, value]) => {
                if (key !== "image") {
                    formData.append(key, value?.toString() ?? "");
                }
            });

            // Append image if exists
            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await apiRequest("POST", "/api/articles", formData);
            return await response.json();
        },
        onSuccess: () => {
            toast({
                title: "Article created",
                description: "The article has been created successfully.",
            });
            setShowAddArticleModal(false);
            queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        },
        onError: (error) => {
            toast({
                title: "Error creating article",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Update article mutation
    const updateArticleMutation = useMutation({
        mutationFn: async (data) => {
            const { id, ...rest } = data;
            const formData = new FormData();

            // Append all text fields
            Object.entries(rest).forEach(([key, value]) => {
                if (key !== "image") {
                    formData.append(key, value?.toString() ?? "");
                }
            });

            // Append image if exists
            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await apiRequest(
                "PATCH",
                `/api/articles/${id}`,
                formData
            );
            return await response.json();
        },
        onSuccess: () => {
            toast({
                title: "Article updated",
                description: "The article has been updated successfully.",
            });
            setShowAddArticleModal(false);
            setCurrentArticle(null);
            queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
        },
        onError: (error) => {
            toast({
                title: "Error updating article",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Delete article mutation
    const deleteArticleMutation = useMutation({
        mutationFn: async (id) => {
            const response = await apiRequest("DELETE", `/api/articles/${id}`, null);
            return await response.json();
        },
        onSuccess: () => {
            toast({
                title: "Article deleted",
                description: "The article has been deleted successfully.",
            });
            setShowDeleteConfirm(false);
            setCurrentArticle(null);
            queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
            queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        },
        onError: (error) => {
            toast({
                title: "Error deleting article",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Handle article form submission
    const handleSubmit = (data) => {
        if (currentArticle) {
            updateArticleMutation.mutate({ ...data, id: currentArticle.id });
        } else {
            createArticleMutation.mutate(data);
        }
    };

    // Handle article edit
    const handleEdit = (article) => {
        setCurrentArticle(article);
        setShowAddArticleModal(true);
    };

    // Handle article delete
    const handleDelete = (article) => {
        setCurrentArticle(article);
        setShowDeleteConfirm(true);
    };

    // Handle delete confirmation
    const confirmDelete = () => {
        if (currentArticle) {
            deleteArticleMutation.mutate(currentArticle.id);
        }
    };

    // Handle bulk actions
    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(articles.map((article) => article.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id, checked) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        }
    };

    // Filter articles by search query
    const filteredArticles = articles.filter(
        (article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (article.author &&
                article.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Find category name by id
    const getCategoryName = (categoryId) => {
        if (!categoryId) return "";
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : "";
    };

    return (
        <DashboardLayout title="Articles">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                        <h2 className="text-xl font-semibold">Article Management</h2>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" /> Filter{" "}
                                        <ChevronDown className="h-3 w-3 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>All Articles</DropdownMenuItem>
                                    <DropdownMenuItem>Published</DropdownMenuItem>
                                    <DropdownMenuItem>Drafts</DropdownMenuItem>
                                    <DropdownMenuItem>Featured</DropdownMenuItem>
                                    <DropdownMenuItem>Breaking News</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                onClick={() => {
                                    setCurrentArticle(null);
                                    setShowAddArticleModal(true);
                                }}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Article
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedIds.length === articles.length}
                                            onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                        />
                                    </TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Published</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Views</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingArticles ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            <div className="flex justify-center">
                                                <div className="loader h-8 w-8 rounded-full border-4 border-gray-200"></div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Loading articles...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredArticles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10">
                                            <div className="text-gray-500 dark:text-gray-400">
                                                No articles found
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredArticles.map((article) => (
                                        <TableRow key={article.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(article.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectItem(article.id, !!checked)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {article.title}
                                                {article.isDraft && (
                                                    <Badge variant="outline" className="ml-2">
                                                        Draft
                                                    </Badge>
                                                )}
                                                {article.isBreakingNews && (
                                                    <Badge variant="destructive" className="ml-2">
                                                        Breaking
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {getCategoryName(article.categoryId || undefined)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    article.createdAt || new Date(),
                                                    "MMM d, yyyy"
                                                )}
                                            </TableCell>
                                            <TableCell>{article.author || "—"}</TableCell>
                                            <TableCell>{article.viewCount || 0}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(article)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(article)}
                                                    className="text-destructive hover:text-destructive/90"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <a
                                                        href={`/article/${article.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredArticles.length > 0 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <p className="text-sm text-gray-700 dark:text-gray-400">
                                    Showing <span className="font-medium">1</span> to{" "}
                                    <span className="font-medium">{filteredArticles.length}</span>{" "}
                                    of <span className="font-medium">{articles.length}</span>{" "}
                                    results
                                </p>
                            </div>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <Button variant="outline" className="rounded-l">
                                    <svg
                                        className="w-3 h-3 mr-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 1 1 5l4 4"
                                        />
                                    </svg>
                                    Prev
                                </Button>
                                <Button variant="outline" className="rounded-r border-l-0">
                                    Next
                                    <svg
                                        className="w-3 h-3 ml-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Article Modal */}
            <Dialog open={showAddArticleModal} onOpenChange={setShowAddArticleModal}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {currentArticle ? "Edit Article" : "Add New Article"}
                        </DialogTitle>
                    </DialogHeader>
                    <ArticleForm
                        categories={categories}
                        article={currentArticle || undefined}
                        isSubmitting={
                            createArticleMutation.isPending || updateArticleMutation.isPending
                        }
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowAddArticleModal(false);
                            setCurrentArticle(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this article?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All article data will be permanently
                            removed from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setCurrentArticle(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {deleteArticleMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-4 w-4 mr-1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Deleting...
                                </span>
                            ) : (
                                "Yes, delete it"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
