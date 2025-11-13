import { User } from "./mockData";

const AUTH_KEY = "blog_auth_user";

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setStoredUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/login";
};
