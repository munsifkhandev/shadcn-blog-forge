# BlogApp - Modern Blogging Platform

A fully-featured, frontend-only blogging application built with React, TypeScript, and modern web technologies. This application demonstrates a complete blog platform with authentication, rich text editing, and full CRUD operations using localStorage for data persistence.

## 🌟 Features

### User Authentication
- **Sign Up**: New user registration with form validation
- **Login**: Secure user login with password verification
- **Session Management**: Persistent user sessions using localStorage
- **Protected Routes**: Dashboard and post editing restricted to authenticated users

### Blog Management
- **Create Posts**: Rich text editor for creating blog posts with formatting
- **Edit Posts**: Full editing capabilities for your own posts
- **Delete Posts**: Remove posts with confirmation dialog
- **View Posts**: Public blog listing and detail pages
- **Search**: Real-time search functionality for blog posts
- **Authorization**: Users can only edit/delete their own posts

### User Interface
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Rich Text Editor**: React Quill integration for content creation
- **Toast Notifications**: User feedback for all actions
- **Beautiful UI Components**: shadcn/ui component library
- **Smooth Navigation**: React Router for seamless page transitions

## 🛠️ Tech Stack

### Core Technologies
- **React 18.3.1** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### Form Handling & Validation
- **React Hook Form 7.61.1** - Form state management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers 3.10.0** - Form validation integration

### UI Components (shadcn/ui)
- **Button** - Interactive buttons with variants
- **Card** - Content containers
- **Input** - Text input fields
- **Textarea** - Multi-line text input
- **Form Components** - Form field wrappers
- **Alert Dialog** - Confirmation dialogs
- **Toast** - Notification system
- **Tooltip** - Contextual help

### Rich Text Editor
- **React Quill 2.0.0** - WYSIWYG editor for blog content

### Styling & Icons
- **Lucide React 0.462.0** - Icon library
- **Tailwind Merge** - Class name merging utility
- **Class Variance Authority** - Component variant management

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── alert-dialog.tsx
│   │   └── ... (more UI components)
│   ├── Navbar.tsx            # Navigation bar
│   ├── BlogCard.tsx          # Blog post card component
│   ├── RichTextEditor.tsx    # React Quill wrapper
│   └── NavLink.tsx           # Active link component
├── pages/
│   ├── Home.tsx              # Landing page
│   ├── Blogs.tsx             # Blog listing with search
│   ├── BlogDetail.tsx        # Individual blog post view
│   ├── Login.tsx             # Login page
│   ├── Signup.tsx            # Registration page
│   ├── Dashboard.tsx         # User dashboard
│   ├── CreatePost.tsx        # Create new post
│   └── EditPost.tsx          # Edit existing post
├── lib/
│   ├── auth.ts               # Authentication utilities
│   ├── storage.ts            # localStorage CRUD operations
│   ├── validations.ts        # Zod validation schemas
│   ├── mockData.ts           # Initial mock data
│   └── utils.ts              # Utility functions
├── hooks/
│   ├── useAuth.ts            # Authentication hook
│   └── use-toast.ts          # Toast notification hook
├── App.tsx                   # Main app component with routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📖 Usage Guide

### Initial Setup
On first load, the application automatically initializes with mock data:
- 2 demo users (John Doe, Jane Smith)
- 6 sample blog posts

### Creating an Account
1. Navigate to **Sign Up** page
2. Fill in:
   - Name (min 2 characters)
   - Email (valid format)
   - Password (min 6 characters)
3. Click **Sign Up**

### Logging In
1. Navigate to **Login** page
2. Enter email and password
3. Click **Login**

**Demo Credentials:**
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

### Creating a Blog Post
1. Login to your account
2. Go to **Dashboard**
3. Click **Create New Post**
4. Fill in:
   - Title (min 3 characters)
   - Slug (URL-friendly identifier)
   - Excerpt (short description)
   - Content (rich text editor)
   - Image URL (optional)
5. Click **Create Post**

### Editing a Post
1. Go to **Dashboard**
2. Click **Edit** on your post
3. Modify fields
4. Click **Update Post**

### Deleting a Post
1. Go to **Dashboard**
2. Click **Delete** on your post
3. Confirm deletion in dialog

### Searching Posts
1. Navigate to **Blogs** page
2. Type in search box
3. Results filter in real-time

## 🔒 Authentication System

### How It Works
- **Registration**: User data stored in localStorage with hashed password
- **Login**: Credentials verified against stored user data
- **Session**: Current user stored in localStorage
- **Logout**: Session cleared from localStorage

### Authorization
- Post editing: Only post author can edit
- Post deletion: Only post author can delete
- Dashboard: Only authenticated users can access

## 💾 Data Storage

### localStorage Structure

```javascript
// Users
lovable-blog-users: [
  {
    id: "uuid",
    name: "John Doe",
    email: "john@example.com",
    passwordHash: "hashed_password",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
]

// Posts
lovable-blog-posts: [
  {
    id: "uuid",
    title: "Post Title",
    slug: "post-title",
    excerpt: "Short description",
    content: "<p>HTML content</p>",
    imageUrl: "https://...",
    authorId: "user-uuid",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
]

// Current User
lovable-blog-current-user: {
  id: "uuid",
  name: "John Doe",
  email: "john@example.com"
}
```

## 🎨 UI Components Used

### shadcn/ui Components
| Component | Usage |
|-----------|-------|
| Button | All CTAs, form submissions, navigation |
| Card | Blog cards, form containers |
| Input | Text fields, email, password inputs |
| Textarea | Excerpt field |
| Form | React Hook Form integration |
| AlertDialog | Delete confirmation |
| Toast | Success/error notifications |
| TooltipProvider | App-level tooltip support |

### Custom Components
- **Navbar**: Responsive navigation with auth state
- **BlogCard**: Blog post preview card
- **RichTextEditor**: React Quill wrapper with custom styling
- **NavLink**: Active route highlighting

## 🔍 Form Validation

All forms use **Zod** schemas for validation:

### Signup Schema
```typescript
- name: min 2 characters
- email: valid email format
- password: min 6 characters
```

### Login Schema
```typescript
- email: valid email format
- password: min 6 characters
```

### Post Schema
```typescript
- title: min 3 characters
- slug: min 3 characters, URL-friendly
- excerpt: min 10 characters
- content: min 50 characters
- imageUrl: optional, valid URL
```

## 🎯 Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/blogs` | Blogs | Public |
| `/blog/:slug` | BlogDetail | Public |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/dashboard` | Dashboard | Protected |
| `/create-post` | CreatePost | Protected |
| `/edit-post/:id` | EditPost | Protected (Owner only) |

## 🚀 Deployment

### Deploy on Lovable
1. Open project in [Lovable](https://lovable.dev/projects/a1a72ac7-b367-4a96-822d-856d2df50e5f)
2. Click **Share → Publish**
3. Your app is live!

### Deploy Elsewhere
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Supported Platforms
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🔧 Configuration

### Tailwind Configuration
Custom design tokens in `tailwind.config.ts`:
- Color system
- Typography
- Spacing
- Animations

### Vite Configuration
Optimized build settings in `vite.config.ts`:
- React plugin
- Path aliases (@/)
- Build optimizations

## 🐛 Troubleshooting

### Common Issues

**Posts not appearing after creation**
- Check browser console for errors
- Verify localStorage has data
- Refresh the page

**Login not working**
- Ensure correct email/password
- Check localStorage for user data
- Try demo credentials

**Rich text editor not loading**
- Check React Quill CSS import
- Verify component mounting

### Clear Data
To reset the application:
```javascript
// In browser console
localStorage.removeItem('lovable-blog-users')
localStorage.removeItem('lovable-blog-posts')
localStorage.removeItem('lovable-blog-current-user')
location.reload()
```

## 📝 Development Notes

### Adding New Features
1. Create component in `src/components/` or `src/pages/`
2. Add route in `App.tsx` if needed
3. Use shadcn/ui components for UI
4. Follow existing patterns for state management

### Code Style
- TypeScript strict mode
- ESLint configuration included
- Prettier formatting recommended

## 🤝 Contributing

This is a Lovable project. To contribute:
1. Use Lovable editor for changes
2. Or push to connected Git repository
3. Changes sync automatically

## 📄 License

This project is open source and available for modification.

## 🔗 Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Project URL](https://lovable.dev/projects/a1a72ac7-b367-4a96-822d-856d2df50e5f)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [React Quill](https://github.com/zenoamaro/react-quill)

## 💡 Future Enhancements

- Backend integration (Lovable Cloud)
- Image upload functionality
- Comment system
- Post categories and tags
- User profiles
- Social sharing
- SEO optimization
- Analytics integration

---

**Built with ❤️ using Lovable**
