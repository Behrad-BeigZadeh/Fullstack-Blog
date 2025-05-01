"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopPosts } from "@/apis/api";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

const TopPosts = () => {
  const { data, isLoading, isError, error } = useQuery<Post[]>({
    queryKey: ["topPosts"],
    queryFn: getTopPosts,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <Spinner />;
  if (isError) {
    toast.error(error?.message || "Failed to fetch top posts");
    return null;
  }

  return (
    <div className="py-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition flex flex-col"
          >
            <div className="w-full h-52 overflow-hidden bg-gray-100">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-red-500">. {post.category}</p>
              <h2 className="text-lg font-semibold text-zinc-900">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                By {post.author.username} • {post.likeCount} likes
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopPosts;
