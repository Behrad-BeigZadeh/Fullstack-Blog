import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", refreshAccessToken);

export default router;
