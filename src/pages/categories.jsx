import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "../components/layout/dashboard-layout.jsx";
import { CategoryGrid } from "../components/news/category-grid.jsx";
import { CategoryForm } from "../components/news/category-form.jsx";
import { Button } from "../components/ui/button.jsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog.jsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog.jsx";
import { useToast } from "../hooks/use-toast.js";
import { Plus, Loader2 } from "lucide-react";
import { getCategories } from "../data.ts";

export default function Categories() {
    const { toast } = useToast();

    // State for dialogs
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["/api/categories"],
        queryFn: () => getCategories(),
    });

    // Handle category edit
    const handleEdit = (category) => {
        setCurrentCategory(category);
        setShowAddCategoryModal(true);
    };

    // Handle category delete
    const handleDelete = (category) => {
        setCurrentCategory(category);
        setShowDeleteConfirm(true);
    };

    // Handle delete confirmation
    const confirmDelete = () => {
        // if (currentCategory) {
        //   deleteCategoryMutation.mutate(currentCategory.id);
        // }
    };

    return (
        <DashboardLayout title="Categories">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
                        <h2 className="text-xl font-semibold">Category Management</h2>
                        <Button
                            onClick={() => {
                                setCurrentCategory(null);
                                setShowAddCategoryModal(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Category
                        </Button>
                    </div>
                </div>
                <div className="p-4">
                    {isLoading ? (
                        <div className="text-center py-10">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Loading categories...
                            </h3>
                            <Loader2 className="mx-auto h-6 w-6 text-gray-400 animate-spin" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-10">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No categories found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Get started by creating a new category.
                            </p>
                            <Button
                                onClick={() => {
                                    setCurrentCategory(null);
                                    setShowAddCategoryModal(true);
                                }}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Category
                            </Button>
                        </div>
                    ) : (
                        <CategoryGrid
                            categories={categories}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Add/Edit Category Modal */}
            <Dialog
                open={showAddCategoryModal}
                onOpenChange={setShowAddCategoryModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {currentCategory ? "Edit Category" : "Add New Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        category={currentCategory || undefined}
                        isSubmitting={false}
                        onCancel={() => {
                            setShowAddCategoryModal(false);
                            setCurrentCategory(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this category?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Articles in this category may be
                            affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setCurrentCategory(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Yes, delete it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
