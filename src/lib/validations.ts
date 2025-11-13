import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  excerpt: z
    .string()
    .trim()
    .min(10, { message: "Excerpt must be at least 10 characters" })
    .max(500, { message: "Excerpt must be less than 500 characters" }),
  content: z
    .string()
    .trim()
    .min(50, { message: "Content must be at least 50 characters" })
    .max(50000, { message: "Content must be less than 50,000 characters" }),
  imageUrl: z
    .string()
    .trim()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
});

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" })
    .max(100, { message: "Password must be less than 100 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Please confirm your new password" })
    .max(100, { message: "Password must be less than 100 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PostFormData = z.infer<typeof postSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
