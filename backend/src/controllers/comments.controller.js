import prisma from "../lib/prisma.js";

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.user.id,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.log("error in createComment controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.log("error in getCommentsByPostId controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("error in deleteComment controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
