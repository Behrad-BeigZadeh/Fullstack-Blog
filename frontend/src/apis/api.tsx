import api from "@/lib/axios";
import { getCurrentUser } from "@/stores/userStore";

// Get All posts
export const getPosts = async () => {
  try {
    const { data } = await api.get("/api/posts");
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
    const { data } = await api.get(`/api/posts/${id}`, {
      headers,
    });
    return data;
  } catch (error) {
    console.log("Error fetching post", error);
    throw error;
  }
};

// Create post
export const createPost = async (formData: FormData) => {
  try {
    const { data } = await api.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.log("Error creating post", error);
    throw error;
  }
};

// Get Top posts
export const getTopPosts = async () => {
  try {
    const { data } = await api.get("/api/posts/top");
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
    const { data } = await api.put(`/api/posts/${postId}/reaction`, { type });
    return data;
  } catch (error) {
    console.log("Error toggling reaction", error);
    throw error;
  }
};

// Add comment
export const addComment = async (postId: string, commentText: string) => {
  try {
    const { data } = await api.post(`/api/posts/${postId}/comments`, {
      commentText,
    });
    return data;
  } catch (error) {
    console.log("Error adding comment", error);
    throw error;
  }
};

// Get all comments
export const getComments = async (postId: string) => {
  try {
    const { data } = await api.get(`/api/posts/${postId}/comments`);
    return data;
  } catch (error) {
    console.log("Error fetching comments", error);
    throw error;
  }
};

// Get user posts

export const getUserPosts = async () => {
  try {
    const { data } = await api.get("/api/posts/userPosts");
    return data;
  } catch (error) {
    console.log("Error fetching user posts", error);
    throw error;
  }
};

// Delete user post
export const deleteUserPost = async (postId: string) => {
  try {
    const { data } = await api.delete(`/api/posts/${postId}`);
    return data;
  } catch (error) {
    console.log("Error fetching user posts", error);
    throw error;
  }
};

// Update a post
export const updateUserPost = async (formData: FormData, postId: string) => {
  try {
    const { data } = await api.put(
      `/api/posts/${postId}/updatePost`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
    const { data } = await api.post("/api/auth/signup", {
      username,
      email,
      password,
    });
    return data;
  } catch (error) {
    console.log("Error signing up", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data;
  } catch (error) {
    console.log("Error logging in", error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await api.post("/api/auth/logout", {});
  } catch (error) {
    console.log("Error logging out", error);
    throw error;
  }
};
