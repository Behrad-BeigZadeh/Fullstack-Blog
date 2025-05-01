import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostById,
  toggleReaction,
  leaveComment,
  getComments,
  getUserPosts,
  getTopPosts,
} from "../controllers/posts.controller.js";
import { verifyAccessToken } from "../middleware/middlewares.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Get users posts
router.get("/userPosts", verifyAccessToken, getUserPosts);

// Get Top posts

router.get("/top", getTopPosts);

// Get a single post
router.get("/:id", getPostById);

// Create a new post
router.post("/", verifyAccessToken, upload.single("coverImage"), createPost);

// Update a post
router.put(
  "/:postId/updatePost",
  verifyAccessToken,
  upload.single("coverImage"),
  updatePost
);

// Delete a post
router.delete("/:postId", verifyAccessToken, deletePost);

// Like or dislike a post
router.put("/:id/reaction", verifyAccessToken, toggleReaction);

// Add comment to a post
router.post("/:postId/comments", verifyAccessToken, leaveComment);

// Get comments for a post
router.get("/:postId/comments", getComments);

export default router;
