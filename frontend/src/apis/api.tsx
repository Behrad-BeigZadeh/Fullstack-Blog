import { getAccessToken, getCurrentUser } from "@/stores/useAuthStore";
import axios from "axios";

// Get All posts
export const getPosts = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.log("Error fetching posts", error);
    throw error;
  }
};

let headers = {};
const user = getCurrentUser();
if (user) {
  headers = {
    "Content-Type": "application/json",
    userId: user.id,
  };
}
if (!user) {
  headers = {
    "Content-Type": "application/json",
  };
}

// GEt a single post by id
export const getPost = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${id}`,
      {
        withCredentials: true,
        headers,
      }
    );
    return data;
  } catch (error) {
    console.log("Error fetching post", error);
    throw error;
  }
};

// Create post
export const createPost = async (formData: FormData) => {
  try {
    const token = getAccessToken();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts`,
      formData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error creating post", error);
    throw error;
  }
};

// Get Top posts
export const getTopPosts = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/top`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.log("Error fetching top posts", error);
    throw error;
  }
};

// Handling Like and Dislikes
export const toggleReaction = async (
  postId: string,
  type: "LIKE" | "DISLIKE"
) => {
  try {
    const token = getAccessToken();
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/reaction`,
      { type },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error toggling reaction", error);
    throw error;
  }
};

// Add comment
export const addComment = async (postId: string, commentText: string) => {
  try {
    const token = getAccessToken();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/comments`,
      { commentText },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error adding comment", error);
    throw error;
  }
};

// Get all comments
export const getComments = async (postId: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/comments`,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.log("Error fetching comments", error);
    throw error;
  }
};

// Get user posts

export const getUserPosts = async () => {
  try {
    const token = getAccessToken();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/userPosts`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error fetching user posts", error);
    throw error;
  }
};

// Delete user post
export const deleteUserPost = async (postId: string) => {
  try {
    const token = getAccessToken();
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error fetching user posts", error);
    throw error;
  }
};

// Update a post
export const updateUserPost = async (formData: FormData, postId: string) => {
  try {
    const token = getAccessToken();
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/updatePost`,
      formData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error creating post", error);
    throw error;
  }
};

// Authenticate user
export const signup = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/signup`,
      { username, email, password },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.log("Error signing up", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.log("Error logging in", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.log("Error logging out", error);
    throw error;
  }
};
