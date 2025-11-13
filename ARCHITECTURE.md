# Architecture Documentation

## System Overview

BlogApp is a single-page application (SPA) built with React that operates entirely on the client-side. It uses localStorage as a persistence layer, simulating backend functionality without requiring a server.

## Architecture Pattern

### Frontend Architecture
The application follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  ┌───────────────────────────────────────────┐  │
│  │          React Application                │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │         Routing Layer               │  │  │
│  │  │      (React Router DOM)             │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │         Page Components             │  │  │
│  │  │  Home | Blogs | Dashboard | Auth    │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      Shared Components              │  │  │
│  │  │  Navbar | BlogCard | RichTextEditor │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │         UI Components               │  │  │
│  │  │     (shadcn/ui library)             │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      Business Logic Layer           │  │  │
│  │  │  auth.ts | storage.ts | validation  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      Custom Hooks Layer             │  │  │
│  │  │    useAuth | useToast               │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │          localStorage API                 │  │
│  │  users | posts | current-user            │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
User Action → Form Submission → Validation (Zod)
    ↓
React Hook Form → auth.ts utilities
    ↓
storage.ts (localStorage operations)
    ↓
State Update (useAuth hook)
    ↓
UI Re-render (Navbar, Protected Routes)
```

### Blog CRUD Flow

```
User Action (Create/Edit/Delete)
    ↓
Form Submission → Validation (Zod)
    ↓
storage.ts (CRUD operations)
    ↓
localStorage update
    ↓
Component re-fetch → State update
    ↓
UI Re-render (Dashboard, Blog List)
    ↓
Toast Notification (feedback)
```

## Component Hierarchy

### Page Components

```
App (Router Provider)
├── Home
│   └── Hero Section + Feature Cards
├── Blogs
│   ├── Search Bar
│   └── BlogCard (multiple)
├── BlogDetail
│   └── Post Content + Author Info
├── Login
│   └── Login Form (React Hook Form)
├── Signup
│   └── Signup Form (React Hook Form)
├── Dashboard
│   ├── Post Stats
│   └── Post Cards (editable)
├── CreatePost
│   └── Post Form + RichTextEditor
└── EditPost
    └── Post Form + RichTextEditor (prefilled)
```

### Shared Components

```
Navbar
├── Logo/Brand Link
├── Navigation Links
└── Auth Status (conditional)
    ├── Login/Signup (unauthenticated)
    └── Dashboard/Logout (authenticated)

BlogCard
├── Image (optional)
├── Title
├── Excerpt
├── Author + Date
└── Read More Button

RichTextEditor
└── React Quill Instance
    ├── Toolbar (formats)
    └── Editor Content
```

## State Management

### Global State
- **Current User**: Managed via `useAuth` hook + localStorage
- **Toast Notifications**: Managed via `useToast` hook

### Local State
- **Form Data**: Managed by React Hook Form
- **Posts/Users**: Fetched from localStorage per component
- **Search Query**: Local state in Blogs component

### State Persistence
```javascript
localStorage keys:
- lovable-blog-users: User[]
- lovable-blog-posts: Post[]
- lovable-blog-current-user: User | null
```

## Routing Strategy

### Public Routes
- `/` - Home (landing page)
- `/blogs` - Blog listing
- `/blog/:slug` - Individual blog post
- `/login` - Authentication
- `/signup` - Registration

### Protected Routes
- `/dashboard` - User's posts (requires auth)
- `/create-post` - Create new post (requires auth)
- `/edit-post/:id` - Edit post (requires auth + ownership)

### Route Protection
```typescript
// Check in component
const { user } = useAuth();

useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);
```

## Form Handling Architecture

### Form Flow
```
User Input
    ↓
React Hook Form (state management)
    ↓
Zod Schema (validation)
    ↓
onSubmit handler
    ↓
Business Logic (auth/storage)
    ↓
Success/Error handling
    ↓
Toast Notification
    ↓
Navigation (redirect)
```

### Validation Layer
```typescript
Zod Schema Definition
    ↓
zodResolver integration
    ↓
Real-time validation
    ↓
Error message display
```

## Styling Architecture

### Design System Layers

```
Tailwind Config (tailwind.config.ts)
├── Custom colors
├── Typography
├── Spacing
└── Animations
    ↓
Global Styles (index.css)
├── CSS variables
├── Base styles
└── Custom utilities
    ↓
Component Styles
├── shadcn/ui (pre-styled)
└── Custom classes (Tailwind)
```

### Theming Strategy
- CSS variables for colors
- Tailwind utility classes for layout
- shadcn/ui for consistent components
- Responsive breakpoints (mobile-first)

## Data Models

### User Model
```typescript
interface User {
  id: string;              // UUID
  name: string;            // Display name
  email: string;           // Unique identifier
  passwordHash: string;    // Hashed password
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

### Post Model
```typescript
interface Post {
  id: string;              // UUID
  title: string;           // Post title
  slug: string;            // URL-friendly identifier
  excerpt: string;         // Short description
  content: string;         // HTML content from Quill
  imageUrl?: string;       // Optional cover image
  authorId: string;        // Foreign key to User
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

## Security Considerations

### Client-Side Security
- **Password hashing**: Simulated (not real security)
- **Session management**: localStorage (not secure for production)
- **Authorization checks**: Client-side only (bypassable)

### Production Recommendations
⚠️ **This is a demo/learning project**. For production:
1. Implement server-side authentication
2. Use secure session tokens (JWT/OAuth)
3. Hash passwords server-side (bcrypt/argon2)
4. Implement HTTPS
5. Add CSRF protection
6. Validate data server-side
7. Use secure database (not localStorage)

## Performance Considerations

### Optimization Strategies
1. **Code Splitting**: React.lazy for route-based splitting
2. **Memoization**: React.memo for expensive components
3. **Virtual Scrolling**: For large blog lists
4. **Image Optimization**: Lazy loading images
5. **Bundle Size**: Tree-shaking unused code

### Current Limitations
- All posts loaded in memory
- No pagination (performance impact with many posts)
- localStorage size limits (5-10MB typically)
- No server-side rendering (SEO limitations)

## Extensibility Points

### Easy Extensions
1. **Add Categories/Tags**: Extend Post model
2. **User Profiles**: Add profile page + avatar
3. **Comments**: New model + components
4. **Likes/Reactions**: Extend Post model
5. **Draft Posts**: Add status field

### Backend Migration Path
```
localStorage → Backend API
├── Auth → JWT/OAuth
├── Posts → Database (PostgreSQL/MongoDB)
├── Storage → S3/Cloudinary
└── Real-time → WebSockets
```

### Suggested Backend Stack
- **Lovable Cloud** (easiest)
- **Supabase** (PostgreSQL + Auth + Storage)
- **Firebase** (NoSQL + Auth + Hosting)
- **Custom API** (Node.js + Express + PostgreSQL)

## Testing Strategy

### Recommended Testing Approach
```
Unit Tests
├── Utility functions (auth, storage, validation)
├── Custom hooks (useAuth)
└── Pure components

Integration Tests
├── Form submissions
├── Navigation flows
└── CRUD operations

E2E Tests
├── User registration flow
├── Blog creation flow
└── Authentication flow
```

### Testing Tools
- **Vitest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright/Cypress**: E2E testing

## Deployment Architecture

### Build Process
```
Source Code (TypeScript + React)
    ↓
Vite Build
    ↓
Transpile (TypeScript → JavaScript)
    ↓
Bundle (Rollup)
    ↓
Optimize (minify, tree-shake)
    ↓
Static Assets (dist/)
    ↓
Deploy to CDN/Static Host
```

### Hosting Options
- **Lovable**: One-click deployment
- **Vercel/Netlify**: Git-based deployment
- **GitHub Pages**: Free static hosting
- **Cloudflare Pages**: Global CDN
- **AWS S3 + CloudFront**: Scalable hosting

## Development Workflow

### Local Development
```
1. npm install      → Install dependencies
2. npm run dev      → Start dev server (HMR enabled)
3. Code changes     → Automatic reload
4. Test in browser  → localhost:5173
5. Commit changes   → Git versioning
```

### Production Build
```
1. npm run build    → Create optimized build
2. npm run preview  → Test production build locally
3. Deploy           → Push to hosting service
```

## Monitoring & Debugging

### Development Tools
- **React DevTools**: Component inspection
- **Redux DevTools**: State management (if added)
- **Vite DevTools**: Build analysis
- **Browser Console**: Error logging

### Error Handling
- Form validation errors → Toast notifications
- API errors (localStorage) → Console logs
- Routing errors → 404 page
- Authentication errors → Redirect to login

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintainer**: BlogApp Team