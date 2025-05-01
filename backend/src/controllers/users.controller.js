import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = createAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in refreshAccessToken:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Username already exists select something else" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);

    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        accessToken,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await prisma.user.update({
          where: { id: decoded.userId },
          data: { refreshToken: null },
        });
      } catch (err) {
        console.log("Invalid refresh token during logout");
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("error in logout controller", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
