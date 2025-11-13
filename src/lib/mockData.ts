export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
  },
];

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React",
    slug: "getting-started-with-react",
    excerpt: "Learn the basics of React and start building modern web applications.",
    content: `# Getting Started with React

React is a powerful JavaScript library for building user interfaces. In this guide, we'll explore the fundamentals.

## Why React?

React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.

## Key Concepts

- Components
- Props
- State
- Hooks

Let's dive deeper into each of these concepts and see how they work together to create amazing applications.`,
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    authorId: "1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Mastering TypeScript",
    slug: "mastering-typescript",
    excerpt: "Take your TypeScript skills to the next level with advanced patterns.",
    content: `# Mastering TypeScript

TypeScript adds static typing to JavaScript, making your code more robust and maintainable.

## Advanced Types

Learn about utility types, conditional types, and mapped types to write more expressive code.

## Best Practices

- Use strict mode
- Leverage type inference
- Create reusable type utilities

TypeScript is an essential tool for modern web development.`,
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    authorId: "1",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "3",
    title: "Building Beautiful UIs with Tailwind CSS",
    slug: "building-beautiful-uis-with-tailwind",
    excerpt: "Discover how to create stunning user interfaces using Tailwind CSS.",
    content: `# Building Beautiful UIs with Tailwind CSS

Tailwind CSS is a utility-first CSS framework that makes styling your applications a breeze.

## Utility-First Approach

Instead of writing custom CSS, you compose designs directly in your markup using utility classes.

## Responsive Design

Tailwind makes responsive design intuitive with its mobile-first approach and responsive modifiers.

## Customization

Extend Tailwind's default theme to match your brand perfectly.`,
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
    authorId: "2",
    createdAt: "2024-02-01T09:15:00Z",
    updatedAt: "2024-02-01T09:15:00Z",
  },
  {
    id: "4",
    title: "State Management in Modern React",
    slug: "state-management-modern-react",
    excerpt: "Explore different approaches to managing state in your React applications.",
    content: `# State Management in Modern React

Managing state effectively is crucial for building scalable React applications.

## Built-in Solutions

- useState for local state
- useReducer for complex state logic
- Context API for global state

## External Libraries

Consider libraries like Zustand, Jotai, or Redux for more complex scenarios.

Choose the right tool for your specific needs.`,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    authorId: "2",
    createdAt: "2024-02-10T16:45:00Z",
    updatedAt: "2024-02-10T16:45:00Z",
  },
];

// Mock current user (simulating logged-in user)
export let currentUser: User | null = mockUsers[0];

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;
