"use client";

import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/apis/api";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Post } from "@/lib/types";
import Spinner from "@/components/Spinner";

export default function AllPostsPage() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) return <Spinner />;

  if (isError) {
    toast.error(error?.message || "Failed to fetch posts");
    return <p className="text-center text-red-500">Something went wrong.</p>;
  }

  return (
    <section className="min-h-screen bg-zinc-100 text-zinc-900 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          All Posts
        </h1>

        {posts?.length === 0 && <p>No posts found.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post: Post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow hover:shadow-lg transition transform hover:scale-105"
            >
              <div className="w-full h-52 overflow-hidden relative">
                <img
                  src={post.coverImage}
                  loading="lazy"
                  alt={post.title}
                  className="object-cover w-full h-full transition-all duration-300 ease-in-out"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {post.title}
                </h2>
                <p className="text-sm text-zinc-900 mt-1">
                  By {post.author.username} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
