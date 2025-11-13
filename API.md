# API Documentation

> **Note**: This is a frontend-only application using localStorage. This document describes the internal API patterns used by the storage layer. If you migrate to a backend, these patterns can guide your REST API design.

## Overview

The application uses a localStorage-based data layer that mimics RESTful API patterns. All operations are synchronous and run in the browser.

## Base Storage Keys

```typescript
const STORAGE_KEYS = {
  users: 'lovable-blog-users',
  posts: 'lovable-blog-posts',
  currentUser: 'lovable-blog-current-user'
}
```

## Authentication API

### Register User

**Function**: `addUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>)`

**Purpose**: Create a new user account

**Input**:
```typescript
{
  name: string;
  email: string;
  passwordHash: string;
}
```

**Process**:
1. Check if email already exists
2. Generate UUID for user
3. Add timestamps
4. Store in localStorage
5. Return new user object

**Returns**:
```typescript
User | null
```

**Example**:
```typescript
const newUser = addUser({
  name: "John Doe",
  email: "john@example.com",
  passwordHash: "hashed_password_here"
});
```

**Equivalent REST API**:
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Login

**Function**: `getUserByEmail(email: string)`

**Purpose**: Find user by email for authentication

**Input**:
```typescript
email: string
```

**Returns**:
```typescript
User | undefined
```

**Example**:
```typescript
const user = getUserByEmail("john@example.com");
if (user && user.passwordHash === hashedPassword) {
  setStoredUser(user);
}
```

**Equivalent REST API**:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Get Current User

**Function**: `getStoredUser()`

**Purpose**: Retrieve currently authenticated user

**Returns**:
```typescript
User | null
```

**Example**:
```typescript
const currentUser = getStoredUser();
if (!currentUser) {
  // Redirect to login
}
```

**Equivalent REST API**:
```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

### Set Current User

**Function**: `setStoredUser(user: User)`

**Purpose**: Store authenticated user session

**Input**:
```typescript
user: User
```

**Example**:
```typescript
setStoredUser(userData);
// User is now logged in
```

---

### Logout

**Function**: `logout()`

**Purpose**: Clear user session and redirect

**Process**:
1. Remove current user from localStorage
2. Redirect to home page
3. Reload page

**Example**:
```typescript
logout(); // User logged out and redirected
```

**Equivalent REST API**:
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

---

## Posts API

### Get All Posts

**Function**: `getPosts()`

**Purpose**: Retrieve all blog posts

**Returns**:
```typescript
Post[]
```

**Example**:
```typescript
const posts = getPosts();
// Returns: [{ id, title, slug, ... }, ...]
```

**Equivalent REST API**:
```http
GET /api/posts
```

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "My First Blog",
    "slug": "my-first-blog",
    "excerpt": "This is a short description",
    "content": "<p>Full content here</p>",
    "imageUrl": "https://example.com/image.jpg",
    "authorId": "author-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Single Post

**Purpose**: Retrieve post by ID or slug

**Example**:
```typescript
const posts = getPosts();
const post = posts.find(p => p.slug === 'my-first-blog');
```

**Equivalent REST API**:
```http
GET /api/posts/:slug
```

**Response**:
```json
{
  "id": "uuid",
  "title": "My First Blog",
  "slug": "my-first-blog",
  "excerpt": "This is a short description",
  "content": "<p>Full content here</p>",
  "imageUrl": "https://example.com/image.jpg",
  "authorId": "author-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Create Post

**Function**: `addPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>)`

**Purpose**: Create a new blog post

**Input**:
```typescript
{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  authorId: string;
}
```

**Process**:
1. Generate UUID for post
2. Add timestamps
3. Store in localStorage
4. Return new post object

**Returns**:
```typescript
Post
```

**Example**:
```typescript
const newPost = addPost({
  title: "My New Blog Post",
  slug: "my-new-blog-post",
  excerpt: "A brief description",
  content: "<p>Full article content</p>",
  imageUrl: "https://example.com/cover.jpg",
  authorId: currentUser.id
});
```

**Equivalent REST API**:
```http
POST /api/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My New Blog Post",
  "slug": "my-new-blog-post",
  "excerpt": "A brief description",
  "content": "<p>Full article content</p>",
  "imageUrl": "https://example.com/cover.jpg"
}
```

---

### Update Post

**Function**: `updatePost(postId: string, updates: Partial<Post>)`

**Purpose**: Update an existing post

**Input**:
```typescript
postId: string
updates: {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
}
```

**Process**:
1. Find post by ID
2. Merge updates with existing data
3. Update `updatedAt` timestamp
4. Save to localStorage

**Returns**:
```typescript
boolean
```

**Example**:
```typescript
const success = updatePost(postId, {
  title: "Updated Title",
  content: "<p>Updated content</p>"
});
```

**Equivalent REST API**:
```http
PUT /api/posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}
```

---

### Delete Post

**Function**: `deletePost(postId: string)`

**Purpose**: Delete a post

**Input**:
```typescript
postId: string
```

**Process**:
1. Filter out post from array
2. Save updated array to localStorage

**Returns**:
```typescript
boolean
```

**Example**:
```typescript
const success = deletePost(postId);
if (success) {
  toast({ title: "Post deleted" });
}
```

**Equivalent REST API**:
```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

---

## Users API

### Get All Users

**Function**: `getUsers()`

**Purpose**: Retrieve all users (for author lookups)

**Returns**:
```typescript
User[]
```

**Example**:
```typescript
const users = getUsers();
const author = users.find(u => u.id === post.authorId);
```

**Equivalent REST API**:
```http
GET /api/users
```

---

### Get User by Email

**Function**: `getUserByEmail(email: string)`

**Purpose**: Find user by email (for login/validation)

**Input**:
```typescript
email: string
```

**Returns**:
```typescript
User | undefined
```

**Example**:
```typescript
const existingUser = getUserByEmail("john@example.com");
if (existingUser) {
  // Email already registered
}
```

**Equivalent REST API**:
```http
GET /api/users?email=john@example.com
```

---

## Data Models

### User
```typescript
interface User {
  id: string;              // UUID (auto-generated)
  name: string;            // Min 2 characters
  email: string;           // Valid email, unique
  passwordHash: string;    // Hashed password
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

### Post
```typescript
interface Post {
  id: string;              // UUID (auto-generated)
  title: string;           // Min 3 characters
  slug: string;            // URL-friendly, unique, min 3 chars
  excerpt: string;         // Min 10 characters
  content: string;         // HTML from Quill, min 50 chars
  imageUrl?: string;       // Optional, valid URL
  authorId: string;        // Reference to User.id
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

## Error Handling

### Current Implementation
```typescript
// No formal error responses, returns null/undefined on failure
const user = addUser(userData);
if (!user) {
  // Handle error
}
```

### Recommended REST API Errors
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists",
    "status": 400
  }
}
```

**Common Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not owner)
- `404` - Not Found
- `500` - Server Error

---

## Authentication Flow

### Registration Flow
```
1. POST /api/auth/register
   ↓
2. Validate input (Zod)
   ↓
3. Check if email exists
   ↓
4. Hash password
   ↓
5. Create user record
   ↓
6. Return user (without password)
   ↓
7. Auto-login
```

### Login Flow
```
1. POST /api/auth/login
   ↓
2. Validate credentials
   ↓
3. Find user by email
   ↓
4. Verify password hash
   ↓
5. Generate session/token
   ↓
6. Return user + token
   ↓
7. Store in localStorage
```

### Authorization Check
```
1. Get current user from localStorage
   ↓
2. Verify user exists
   ↓
3. Check ownership (for edit/delete)
   ↓
4. Allow or deny action
```

---

## Query Patterns

### Search Posts
```typescript
const posts = getPosts();
const filtered = posts.filter(post => 
  post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**Equivalent REST API**:
```http
GET /api/posts?search=react
```

---

### Get User's Posts
```typescript
const posts = getPosts();
const userPosts = posts.filter(post => post.authorId === userId);
```

**Equivalent REST API**:
```http
GET /api/posts?authorId={userId}
```

---

### Get Recent Posts
```typescript
const posts = getPosts();
const recent = posts
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 10);
```

**Equivalent REST API**:
```http
GET /api/posts?sort=-createdAt&limit=10
```

---

## Migration Guide

### From localStorage to Backend

**1. Replace storage functions**:
```typescript
// Before (localStorage)
const posts = getPosts();

// After (API)
const posts = await fetch('/api/posts').then(r => r.json());
```

**2. Add async/await**:
```typescript
// Before (synchronous)
const newPost = addPost(postData);

// After (asynchronous)
const newPost = await createPost(postData);
```

**3. Add error handling**:
```typescript
try {
  const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(postData)
  });
  
  if (!response.ok) throw new Error('Failed');
  
  const newPost = await response.json();
} catch (error) {
  toast({ title: "Error creating post" });
}
```

**4. Add loading states**:
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await createPost(postData);
  } finally {
    setLoading(false);
  }
};
```

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**API Type**: localStorage (Client-side)