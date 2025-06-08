import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { aj } from "./src/lib/arcjet.js";
import prisma from "./src/lib/prisma.js";
import postsRouter from "./src/routes/posts.route.js";
import usersRouter from "./src/routes/users.route.js";
import logger from "./src/lib/logger.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
app.use("/api/posts", postsRouter);
app.use("/api/auth", usersRouter);

//controlling number of requests and bot detection with arcjet
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on PORT: ${PORT}`);

  prisma
    .$connect()
    .then(() => {
      logger.info("Connected to database successfully");
    })
    .catch((error) => {
      logger.error("Error connecting to the database", error);
    });
});
