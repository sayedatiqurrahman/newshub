import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert.jsx";
import { useToast } from "../../hooks/use-toast.js";
import { slugify } from "../../lib/utils";

export function CategoryForm({ category, onSuccess }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form setup with validation
    const form = useForm({
        defaultValues: {
            name: category?.name || "",
            slug: category?.slug || "",
            icon: category?.icon || "",
            color: category?.color || "",
            isActive: category?.isActive ?? true,
        },
    });

    // Create or update category mutation
    const mutation = useMutation({
        mutationFn: async (data) => {
            setIsSubmitting(true);
            setError("");

            try {
                // Generate slug from name if not provided
                if (!data.slug && data.name) {
                    data.slug = slugify(data.name);
                }

                // Determine if we're creating or updating
                const url = category
                    ? `/api/categories/${category.id}`
                    : "/api/categories";

                const method = category ? "PATCH" : "POST";

                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to submit: ${response.status} ${response.statusText}`
                    );
                }

                return await response.json();
            } catch (err) {
                console.error("Error submitting category:", err);
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        onSuccess: () => {
            // Invalidate category queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });

            toast({
                title: category ? "Category Updated" : "Category Created",
                description: category
                    ? "Your category has been updated successfully."
                    : "Your category has been created successfully.",
            });

            if (onSuccess) {
                onSuccess();
            }

            if (!category) {
                // Reset form after creating new category
                form.reset({
                    name: "",
                    slug: "",
                    icon: "",
                    color: "",
                    isActive: true,
                });
            }
        },
        onError: (error) => {
            console.error("Mutation error:", error);
            setError(error?.message || "Failed to save category. Please try again.");
            toast({
                title: "Error",
                description: "Failed to save category. Please try again.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {category ? "Edit Category" : "Create New Category"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...form.register("name")}
                                placeholder="Category name"
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                {...form.register("slug")}
                                placeholder="category-slug"
                            />
                            {form.formState.errors.slug && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.slug.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon (CSS class or emoji)</Label>
                            <Input
                                id="icon"
                                {...form.register("icon")}
                                placeholder="📰 or icon-class"
                            />
                            {form.formState.errors.icon && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.icon.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Color (HEX or name)</Label>
                            <Input
                                id="color"
                                {...form.register("color")}
                                placeholder="#3b82f6 or blue"
                                type="color"
                            />
                            {form.formState.errors.color && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.color.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full md:w-auto"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Saving..."
                            : category
                                ? "Update Category"
                                : "Create Category"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
