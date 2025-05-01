import express from "express";
import {
  createComment,
  getCommentsByPostId,
} from "../controllers/comments.controller.js";
import { verifyAccessToken } from "../middleware/middlewares.js";
import { deleteComment } from "../controllers/comments.controller.js";

const router = express.Router();

router.post("/:postId", verifyAccessToken, createComment);
router.get("/:postId", getCommentsByPostId);
router.delete("/:postId/:commentId", verifyAccessToken, deleteComment);

export default router;
