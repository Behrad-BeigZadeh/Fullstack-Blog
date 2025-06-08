import cloudinary from "../lib/cloudinary.js";
import slugify from "slugify";
import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTopPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        reactions: {
          _count: "desc",
        },
      },
      take: 3,
      include: {
        author: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            reactions: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to get top posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.userid || req.headers.userId;

    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let userReaction = null;

    if (user) {
      const reaction = await prisma.reaction.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
      });

      if (reaction) {
        userReaction = reaction.type;
      }
    }

    res.status(200).json({ ...post, userReaction });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let result;

    try {
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog-posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage: result.secure_url,
        imagePublicId: result.public_id,
        category,
        authorId: req.user.id,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, category } = req.body;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;

    if (req.file) {
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog-posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      updateData.coverImage = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const toggleReaction = async (req, res) => {
  const { id: postId } = req.params;
  const { type } = req.body;
  const userId = req.user.id;

  if (!["LIKE", "DISLIKE"].includes(type)) {
    return res.status(400).json({ message: "Invalid reaction type" });
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return res.status(404).json({ message: "Post not found" });

  const existingReaction = await prisma.reaction.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (!existingReaction) {
    await prisma.reaction.create({
      data: {
        type,
        userId,
        postId,
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: type === "LIKE" ? post.likeCount + 1 : post.likeCount,
        dislikeCount:
          type === "DISLIKE" ? post.dislikeCount + 1 : post.dislikeCount,
      },
    });

    return res.status(201).json({ message: "Reaction added" });
  }

  if (existingReaction.type === type) {
    await prisma.reaction.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: type === "LIKE" ? post.likeCount - 1 : post.likeCount,
        dislikeCount:
          type === "DISLIKE" ? post.dislikeCount - 1 : post.dislikeCount,
      },
    });

    return res.status(200).json({ message: "Reaction removed" });
  }

  await prisma.reaction.update({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
    data: { type },
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      likeCount: type === "LIKE" ? post.likeCount + 1 : post.likeCount - 1,
      dislikeCount:
        type === "DISLIKE" ? post.dislikeCount + 1 : post.dislikeCount - 1,
    },
  });

  return res.status(200).json({ message: "Reaction updated" });
};

export const leaveComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const { postId } = req.params;

    const newComment = await prisma.comment.create({
      data: {
        content: commentText,
        postId,
        authorId: req.user.id,
      },
    });

    res.status(201).json("Comment added successfully");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getComments = async (req, res) => {
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
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
