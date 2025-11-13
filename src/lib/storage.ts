import { Post, User } from "./mockData";

const POSTS_KEY = "blog_posts";
const USERS_KEY = "blog_users";

export const getPosts = (): Post[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setPosts = (posts: Post[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const setUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addPost = (post: Post) => {
  const posts = getPosts();
  posts.push(post);
  setPosts(posts);
};

export const updatePost = (postId: string, updatedPost: Partial<Post>) => {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost, updatedAt: new Date().toISOString() };
    setPosts(posts);
  }
};

export const deletePost = (postId: string) => {
  const posts = getPosts();
  setPosts(posts.filter((p) => p.id !== postId));
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((u) => u.email === email);
};
