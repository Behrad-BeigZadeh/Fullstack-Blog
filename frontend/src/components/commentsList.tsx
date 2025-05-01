"use client";

import { Comment } from "@/lib/types";
import Spinner from "./Spinner";

interface Props {
  comments: Comment[];
  isLoading: boolean;
}

export default function CommentsList({ comments, isLoading }: Props) {
  if (isLoading) return <Spinner />;

  return (
    <div className="mt-10">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg shadow-md mt-4"
        >
          <div className="flex justify-between items-center text-sm text-zinc-500">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {comment.author.username}
            </span>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-2 text-zinc-800 dark:text-zinc-200">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}
