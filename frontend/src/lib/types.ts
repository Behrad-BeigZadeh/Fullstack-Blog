export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  createdAt: string | number | Date;
  likeCount: number;
  dislikeCount: number;
  currentUserReaction: "LIKE" | "DISLIKE" | null;
  author: {
    username: string;
  };
  category: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string | number | Date;
  author: {
    username: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
}
