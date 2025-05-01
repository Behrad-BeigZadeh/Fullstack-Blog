"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUserPost, getUserPosts } from "@/apis/api";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Post } from "@/lib/types";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { AxiosError } from "axios";
import { FaEdit } from "react-icons/fa";

export default function UserPosts() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: getUserPosts,
  });

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deleteUserPost(postId),
    onSuccess(data) {
      toast.success(data.message || "Post deleted successfully");
      setShowModal(false);
      setSelectedPostId(null);
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError(error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete the post"
      );
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to fetch your posts");
    }
  }, [error, isError]);

  if (isLoading) return <Spinner />;

  return (
    <>
      <section className="min-h-screen bg-zinc-100 text-zinc-900 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
            Your Posts
          </h1>

          {posts?.length === 0 && (
            <div className="flex flex-col items-center">
              <p className="text-2xl">
                No posts found create your first post here.
              </p>
              <Link className="mt-5 hover:underline" href="/posts/create">
                <button className="bg-red-500 hover:bg-red-600 p-2  text-zinc-100 rounded-lg">
                  {" "}
                  Create Post
                </button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post: Post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow hover:shadow-lg transition hover:scale-105"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {post.title}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-900 mt-1">
                      By {post.author.username} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedPostId(post.id);
                          setShowModal(true);
                        }}
                        className="text-red-500 hover:text-red-600 text-2xl "
                      >
                        <MdDelete />
                      </button>
                      <Link
                        href={`/posts/updatePost/${post.id}`}
                        onClick={() => {
                          setSelectedPostId(post.id);
                        }}
                        className="text-zinc-900 hover:text-zinc-950 text-xl ml-2 "
                      >
                        <FaEdit />
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {showModal && (
        <div className="fixed z-20 inset-0 bg-zinc-900/70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this post
            </h3>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-zinc-900 hover:bg-zinc-950 text-zinc-100 rounded-xl p-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedPostId) {
                    deletePostMutation.mutate(selectedPostId);
                    setShowModal(false);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-zinc-100 rounded-xl p-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
