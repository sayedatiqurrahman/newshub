import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { addArticle, updateArticle } from "../../data.ts";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox.jsx";
import { Label } from "../../components/ui/label.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select.jsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card.jsx";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useToast } from "../../hooks/use-toast";
import { slugify } from "../../lib/utils";

export function ArticleForm({
    article,
    categories = [],
    isSubmitting: externalIsSubmitting = false,
    onSuccess,
    onCancel,
    onSubmit: onSubmitProp,
}) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [imagePreview, setImagePreview] = useState(article?.imageUrl || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const form = useForm({
        defaultValues: {
            title: article?.title || "",
            slug: article?.slug || "",
            summary: article?.summary || "",
            content: article?.content || "",
            imageUrl: article?.imageUrl || "",
            author: article?.author || "",
            categoryId: article?.categoryId || undefined,
            isFeatured: article?.isFeatured || false,
            isBreakingNews: article?.isBreakingNews || false,
            isDraft: article?.isDraft || false,
        },
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (!article && values.title) {
                form.setValue("slug", slugify(values.title));
            }
        });
        return () => subscription.unsubscribe();
    }, [form, article]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setError("");

        const articleData = {
            ...data,
            categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
            imageUrl: imagePreview || data.imageUrl || undefined,
        };

        try {
            if (article) {
                await updateArticle(article.id, articleData);
                toast({
                    title: "Article Updated",
                    description: "Your article has been updated successfully.",
                });
            } else {
                await addArticle(articleData);
                toast({
                    title: "Article Created",
                    description: "Your article has been created successfully.",
                });
                form.reset({
                    title: "",
                    slug: "",
                    summary: "",
                    content: "",
                    imageUrl: "",
                    author: "",
                    categoryId: undefined,
                    isFeatured: false,
                    isBreakingNews: false,
                    isDraft: false,
                });
                setImagePreview(null);
            }

            if (onSuccess) onSuccess();

            await queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
            await queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        } catch (error) {
            console.error("Error submitting article:", error);
            setError(error?.message || "Failed to save article. Please try again.");
            toast({
                title: "Error",
                description: error?.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{article ? "Edit Article" : "Add New Article"}</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                {...form.register("title")}
                                placeholder="Article title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                {...form.register("slug")}
                                placeholder="article-slug"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                            id="summary"
                            {...form.register("summary")}
                            placeholder="Brief summary of the article"
                            rows={2}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            {...form.register("content")}
                            placeholder="Article content"
                            rows={10}
                        />
                    </div>

                    {/* Author & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                {...form.register("author")}
                                placeholder="Author name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Category</Label>
                            <Select
                                defaultValue={article?.categoryId?.toString()}
                                onValueChange={(value) =>
                                    form.setValue("categoryId", parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="image-upload">Image</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-48 rounded-md object-cover"
                                />
                            </div>
                        )}
                        <input type="hidden" {...form.register("imageUrl")} />
                    </div>

                    {/* Options */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={form.watch("isFeatured")}
                                onCheckedChange={(checked) =>
                                    form.setValue("isFeatured", !!checked)
                                }
                            />
                            <Label htmlFor="isFeatured">Featured Article</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isBreakingNews"
                                checked={form.watch("isBreakingNews")}
                                onCheckedChange={(checked) =>
                                    form.setValue("isBreakingNews", !!checked)
                                }
                            />
                            <Label htmlFor="isBreakingNews">Breaking News</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isDraft"
                                checked={form.watch("isDraft")}
                                onCheckedChange={(checked) =>
                                    form.setValue("isDraft", !!checked)
                                }
                            />
                            <Label htmlFor="isDraft">Save as Draft</Label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Saving..."
                            : article
                                ? "Update Article"
                                : "Create Article"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
