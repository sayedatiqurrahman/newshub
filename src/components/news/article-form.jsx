import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Textarea } from "../../components/ui/textarea.jsx";
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
import { Alert, AlertDescription } from "../../components/ui/alert.jsx";
import { useToast } from "../../hooks/use-toast.js";
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
    const [imagePreview, setImagePreview] = useState(
        article?.imageUrl || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form setup with validation
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

    // Generate slug from title
    useEffect(() => {
        const title = form.watch("title");
        if (title && !article) {
            form.setValue("slug", slugify(title));
        }
    }, [form.watch("title"), form, article]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setError("");

            const formData = new FormData();

            // Append all text fields
            Object.keys(data).forEach((key) => {
                if (key !== "image" && data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key].toString());
                }
            });

            // Append image file if present
            const imageInput =
                document.querySelector("#image-upload");
            if (imageInput?.files?.[0]) {
                formData.append("image", imageInput.files[0]);
            }

            // Call external submit handler
            await onSubmitProp(formData);

            toast({
                title: article ? "Article Updated" : "Article Created",
                description: article
                    ? "Your article has been updated successfully."
                    : "Your article has been created successfully.",
            });

            if (onSuccess) {
                onSuccess();
            }

            if (!article) {
                // Reset form after creating new article
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
        } catch (error) {
            console.error("Error submitting article:", error);
            setError(error?.message || "Failed to save article. Please try again.");
            toast({
                title: "Error",
                description: "Failed to save article. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{article ? "Edit Article" : "Create New Article"}</CardTitle>
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
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                {...form.register("title")}
                                placeholder="Article title"
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                {...form.register("slug")}
                                placeholder="article-slug"
                            />
                            {form.formState.errors.slug && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.slug.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                            id="summary"
                            {...form.register("summary")}
                            placeholder="Brief summary of the article"
                            rows={2}
                        />
                        {form.formState.errors.summary && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.summary.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            {...form.register("content")}
                            placeholder="Article content"
                            rows={10}
                        />
                        {form.formState.errors.content && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.content.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                {...form.register("author")}
                                placeholder="Author name"
                            />
                            {form.formState.errors.author && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.author.message}
                                </p>
                            )}
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
                            {form.formState.errors.categoryId && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.categoryId.message}
                                </p>
                            )}
                        </div>
                    </div>

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

                        {/* Hidden input for imageUrl value */}
                        <input
                            type="hidden"
                            {...form.register("imageUrl")}
                            value={article?.imageUrl || ""}
                        />
                    </div>

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

                    <Button
                        type="submit"
                        className="w-full md:w-auto"
                        disabled={isSubmitting}
                    >
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
