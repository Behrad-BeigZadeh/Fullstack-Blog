"use client";
import { Heart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, getComments, getPost } from "@/apis/api";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { useParams } from "next/navigation";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/stores/userStore";
import CommentsList from "@/components/commentsList";
import { useReaction } from "@/hooks/useReaction";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const user = getCurrentUser();
  const [commentText, setCommentText] = useState("");

  // Handling reaction

  const reactionMutation = useReaction(id);
  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    if (!user) {
      toast.error("You must be logged in to react to a post");
      return;
    }

    reactionMutation.mutate({ type });
  };
  //Getting the post
  const {
    data: post,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  // Get all comments
  const {
    data: comments,
    isError: isCommentError,
    error: commentError,
    isLoading: isCommentsLoading,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getComments(id),
  });

  // Adding comment
  const queryClient = useQueryClient();
  const commentMutation = useMutation({
    mutationFn: () => addComment(id, commentText),
    onSuccess: (data) => {
      toast.success(data.message || "Comment added successfully");
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
    onError: () => {
      toast.error("Something went wrong");
      setCommentText("");
    },
  });

  const handleAddComment = () => {
    if (!user) {
      toast.error("You must be logged in to comment on a post");
      return;
    }
    commentMutation.mutate();
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Failed to fetch post");
    }
  }, [isError, error]);

  useEffect(() => {
    if (isCommentError) {
      toast.error(commentError?.message || "Failed to fetch comments");
    }
  }, [isCommentError, commentError]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!post || !post.title || !post.author) {
    return (
      <div className="text-center py-10 text-zinc-500">Post not found</div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 text-zinc-900">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-red-500 hover:underline transition"
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400 mb-6">
        <span>
          By{" "}
          <span className="text-red-400 font-medium">
            {post.author.username}
          </span>
        </span>
        <span className="">|</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        {post.category?.name && (
          <span className="ml-auto bg-zinc-800 text-red-400 px-3 py-1 rounded-full text-xs">
            {post.category.name}
          </span>
        )}
      </div>

      <div className="relative mb-8">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-xl shadow-xl"
        />
        <button
          onClick={() => handleReaction("LIKE")}
          className="absolute bottom-4 left-4 flex items-center space-x-1 bg-white backdrop-blur text-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full hover:scale-105 transition"
        >
          {post.userReaction === "LIKE" && post.userReaction !== "DISLIKE" ? (
            <FaHeart className="text-red-500" size={20} />
          ) : (
            <Heart className="text-red-500" size={20} />
          )}
          <span className="text-sm font-medium">{post.likeCount} Likes</span>
        </button>

        <button
          onClick={() => handleReaction("DISLIKE")}
          className="absolute bottom-4 right-4 flex items-center space-x-1 bg-white backdrop-blur text-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-full hover:scale-105 transition"
        >
          {post.userReaction === "DISLIKE" && post.userReaction !== "LIKE" ? (
            <BiSolidDislike className="text-zinc-900" size={20} />
          ) : (
            <BiDislike className="text-zinc-900" size={20} />
          )}
          <span className="text-sm font-medium">
            {post.dislikeCount} Dislikes
          </span>
        </button>
      </div>

      <div className="prose prose-invert max-w-none ">
        {post.content.split("\n").map((para: string, idx: number) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      <div className="flex mt-10 w-full max-w-2xl">
        <input
          value={commentText}
          required
          onChange={(e) => setCommentText(e.target.value)}
          type="text"
          placeholder="Leave a comment ..."
          className="flex-1 bg-zinc-100 text-zinc-800 px-4 sm:py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 border-[3px] border-zinc-800"
        />
        <button
          onClick={handleAddComment}
          className="w-[30%] text-sm bg-zinc-900 hover:bg-zinc-950 text-zinc-100 px-4 sm:py-2 rounded-r-lg"
        >
          Add Comment
        </button>
      </div>

      <CommentsList comments={comments} isLoading={isCommentsLoading} />
    </section>
  );
}
