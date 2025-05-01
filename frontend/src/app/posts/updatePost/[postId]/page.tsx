"use client";
import { categories } from "@/lib/constants";
import { getPost, updateUserPost } from "@/apis/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function UpdatePostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: null as File | null,
  });

  const router = useRouter();

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  const mutation = useMutation({
    mutationFn: ({
      formData,
      postId,
    }: {
      formData: FormData;
      postId: string;
    }) => updateUserPost(formData, postId),

    onSuccess: () => {
      toast.success("Post updated successfully!");
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to update post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    postData.append("category", formData.category);
    if (formData.image) {
      postData.append("coverImage", formData.image);
    }

    mutation.mutate({ formData: postData, postId });
  };

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        category: post.category || "",
        image: null,
      });
    }
  }, [post]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-zinc-950 text-zinc-100">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6 border border-neutral-800"
      >
        <h1 className="text-3xl font-bold text-center">Update Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl placeholder-neutral-400"
        />

        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={6}
          className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl placeholder-neutral-400"
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files?.[0] || null })
          }
          className="w-full bg-neutral-800 rounded-xl text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600"
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-red-500 text-zinc-100 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          {mutation.isPending ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}
