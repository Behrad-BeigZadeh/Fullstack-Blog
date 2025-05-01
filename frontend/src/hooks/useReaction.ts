import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleReaction } from "@/apis/api";
import { Post } from "@/lib/types";
import toast from "react-hot-toast";

export const useReaction = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type }: { type: "LIKE" | "DISLIKE" }) =>
      toggleReaction(postId, type),
    onMutate: async ({ type }) => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const previousPost = queryClient.getQueryData(["post", postId]);

      queryClient.setQueryData(["post", postId], (old: Post) => {
        if (!old) return old;

        let likeCount = old.likeCount;
        let dislikeCount = old.dislikeCount;
        let currentUserReaction = old.currentUserReaction;

        const isTogglingOff = currentUserReaction === type;

        if (isTogglingOff) {
          if (type === "LIKE") likeCount = Math.max(likeCount - 1, 0);
          else dislikeCount = Math.max(dislikeCount - 1, 0);
          currentUserReaction = null;
        } else {
          if (type === "LIKE") {
            likeCount += 1;
            if (currentUserReaction === "DISLIKE") dislikeCount--;
          } else {
            dislikeCount += 1;
            if (currentUserReaction === "LIKE") likeCount--;
          }
          currentUserReaction = type;
        }

        return {
          ...old,
          likeCount,
          dislikeCount,
          currentUserReaction,
        };
      });

      return { previousPost };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      toast.error("Something went wrong");
    },
    onSuccess: () => {
      toast.success("Reaction updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
