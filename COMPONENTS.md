# Components Documentation

Complete reference for all React components in the BlogApp project.

## Table of Contents
- [Page Components](#page-components)
- [Shared Components](#shared-components)
- [UI Components (shadcn/ui)](#ui-components)
- [Custom Hooks](#custom-hooks)

---

## Page Components

### Home (`src/pages/Home.tsx`)

Landing page component with hero section and feature highlights.

**Route**: `/`

**Features**:
- Hero section with CTA buttons
- Feature cards explaining app capabilities
- Responsive layout

**Props**: None

**Example**:
```tsx
<Home />
```

**Sections**:
1. **Hero**: Main headline, description, CTA buttons
2. **Features**: Three cards (Create, Discover, Share)

---

### Blogs (`src/pages/Blogs.tsx`)

Blog listing page with search functionality.

**Route**: `/blogs`

**Features**:
- Display all published posts
- Real-time search filtering
- Responsive grid layout

**State**:
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [posts, setPosts] = useState<Post[]>([]);
```

**Search Logic**:
```typescript
const filteredPosts = posts.filter(post =>
  post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**Example**:
```tsx
<Blogs />
```

---

### BlogDetail (`src/pages/BlogDetail.tsx`)

Individual blog post view with full content.

**Route**: `/blog/:slug`

**URL Params**:
- `slug` - Post identifier (URL-friendly)

**Features**:
- Full post content display
- Author information
- Rich text rendering
- Back navigation

**Data Fetching**:
```typescript
const { slug } = useParams();
const post = posts.find(p => p.slug === slug);
const author = users.find(u => u.id === post?.authorId);
```

**Example**:
```tsx
// Route: /blog/my-first-post
<BlogDetail />
```

---

### Login (`src/pages/Login.tsx`)

User authentication page.

**Route**: `/login`

**Form Fields**:
- Email (validated)
- Password (min 6 chars)

**Validation Schema**:
```typescript
loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})
```

**Features**:
- React Hook Form integration
- Zod validation
- Error messages
- Loading state
- Auto-redirect on success

**Example**:
```tsx
<Login />
```

**Success Flow**:
1. Validate credentials
2. Set user session
3. Show success toast
4. Redirect to dashboard

---

### Signup (`src/pages/Signup.tsx`)

User registration page.

**Route**: `/signup`

**Form Fields**:
- Name (min 2 chars)
- Email (validated)
- Password (min 6 chars)

**Validation Schema**:
```typescript
signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})
```

**Features**:
- Check for existing email
- Password hashing (simulated)
- Auto-login after signup
- Loading state

**Example**:
```tsx
<Signup />
```

---

### Dashboard (`src/pages/Dashboard.tsx`)

User's blog management interface.

**Route**: `/dashboard`

**Access**: Protected (requires authentication)

**Features**:
- Display user's posts
- Post statistics
- Edit/Delete actions
- Delete confirmation dialog

**Data**:
```typescript
const userPosts = posts.filter(p => p.authorId === user.id);
```

**Actions**:
- **Create New**: Navigate to `/create-post`
- **Edit**: Navigate to `/edit-post/:id`
- **Delete**: Confirm → Remove post → Update list

**Example**:
```tsx
<Dashboard />
```

---

### CreatePost (`src/pages/CreatePost.tsx`)

Blog post creation form.

**Route**: `/create-post`

**Access**: Protected (requires authentication)

**Form Fields**:
- Title (min 3 chars)
- Slug (URL-friendly)
- Excerpt (min 10 chars)
- Content (Rich text, min 50 chars)
- Image URL (optional)

**Validation Schema**:
```typescript
postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  imageUrl: z.string().url().optional()
})
```

**Features**:
- Rich text editor (React Quill)
- Form validation
- Auto-slug generation (optional)
- Loading state
- Success redirect

**Example**:
```tsx
<CreatePost />
```

---

### EditPost (`src/pages/EditPost.tsx`)

Blog post editing form.

**Route**: `/edit-post/:id`

**URL Params**:
- `id` - Post UUID

**Access**: Protected (requires authentication + ownership)

**Authorization**:
```typescript
if (post.authorId !== user.id) {
  toast({ title: "Unauthorized", variant: "destructive" });
  navigate("/dashboard");
}
```

**Features**:
- Pre-filled form with existing data
- Same validation as CreatePost
- Update confirmation
- Ownership verification

**Example**:
```tsx
// Route: /edit-post/abc-123
<EditPost />
```

---

## Shared Components

### Navbar (`src/components/Navbar.tsx`)

Main navigation bar component.

**Props**: None

**Features**:
- Responsive layout
- Brand logo/link
- Navigation links
- Conditional auth UI
- User information display
- Logout button

**Auth States**:
```typescript
// Unauthenticated
- Blogs link
- Login button
- Signup button

// Authenticated
- Blogs link
- Dashboard link
- User name (desktop)
- Logout button
```

**Example**:
```tsx
<Navbar />
```

**Styling**:
- Sticky on scroll
- Border bottom
- Card background
- Hover transitions

---

### BlogCard (`src/components/BlogCard.tsx`)

Blog post preview card.

**Props**:
```typescript
interface BlogCardProps {
  post: Post;
}
```

**Features**:
- Cover image (if provided)
- Post title (clamped to 2 lines)
- Post excerpt (clamped to 3 lines)
- Author name
- Publication date
- Read More CTA

**Example**:
```tsx
<BlogCard post={postData} />
```

**Image Handling**:
```tsx
{post.imageUrl && (
  <img 
    src={post.imageUrl} 
    alt={post.title}
    className="hover:scale-105"
  />
)}
```

---

### RichTextEditor (`src/components/RichTextEditor.tsx`)

React Quill wrapper for rich text editing.

**Props**:
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}
```

**Toolbar Formats**:
- Bold, Italic, Underline, Strike
- Headers (H1, H2)
- Lists (ordered, unordered)
- Blockquote
- Code block
- Link

**Example**:
```tsx
<RichTextEditor 
  value={content}
  onChange={setContent}
/>
```

**Configuration**:
```typescript
modules={{
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean']
  ]
}}
```

---

### NavLink (`src/components/NavLink.tsx`)

Navigation link with active state styling.

**Props**:
```typescript
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  end?: boolean;
}
```

**Features**:
- Active route detection
- Custom active styles
- React Router integration

**Example**:
```tsx
<NavLink 
  to="/dashboard" 
  activeClassName="text-primary font-bold"
>
  Dashboard
</NavLink>
```

---

## UI Components (shadcn/ui)

### Button

**Variants**:
- `default` - Primary action
- `secondary` - Secondary action
- `outline` - Bordered button
- `ghost` - No background
- `destructive` - Danger action
- `link` - Text link style

**Sizes**:
- `default` - Standard height
- `sm` - Small
- `lg` - Large
- `icon` - Square icon button

**Example**:
```tsx
<Button variant="default" size="lg">
  Click Me
</Button>
```

---

### Card

**Sub-components**:
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Heading
- `CardDescription` - Subtitle
- `CardContent` - Main content
- `CardFooter` - Bottom section

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

---

### Input

**Types**:
- `text` - Text input
- `email` - Email input
- `password` - Password input
- `url` - URL input

**Example**:
```tsx
<Input 
  type="email"
  placeholder="Enter email"
  {...field}
/>
```

---

### Form Components

**Components**:
- `Form` - Form wrapper
- `FormField` - Field controller
- `FormItem` - Field container
- `FormLabel` - Field label
- `FormControl` - Input wrapper
- `FormMessage` - Error message

**Example**:
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

### AlertDialog

**Purpose**: Confirmation dialogs

**Sub-components**:
- `AlertDialog` - Container
- `AlertDialogTrigger` - Open trigger
- `AlertDialogContent` - Modal content
- `AlertDialogHeader` - Header section
- `AlertDialogTitle` - Dialog title
- `AlertDialogDescription` - Description
- `AlertDialogFooter` - Action buttons
- `AlertDialogAction` - Confirm button
- `AlertDialogCancel` - Cancel button

**Example**:
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### Toast

**Usage**:
```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success!",
  description: "Post created successfully",
});

// Error toast
toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

---

## Custom Hooks

### useAuth

**Purpose**: Manage authentication state

**Location**: `src/hooks/useAuth.ts`

**Returns**:
```typescript
{
  user: User | null;
  loading: boolean;
}
```

**Example**:
```tsx
const { user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <Navigate to="/login" />;
```

**Implementation**:
```typescript
const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const storedUser = getStoredUser();
  setUser(storedUser);
}, []);
```

---

### useToast

**Purpose**: Show toast notifications

**Location**: `src/hooks/use-toast.ts`

**Returns**:
```typescript
{
  toast: (props: ToastProps) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}
```

**Example**:
```tsx
const { toast } = useToast();

toast({
  title: "Success",
  description: "Action completed",
  duration: 3000,
});
```

---

## Component Patterns

### Form Pattern
```tsx
// 1. Define schema
const schema = z.object({
  field: z.string().min(3)
});

// 2. Setup form
const form = useForm({
  resolver: zodResolver(schema)
});

// 3. Render with Form components
<Form {...form}>
  <FormField ... />
</Form>
```

### Protected Route Pattern
```tsx
const { user } = useAuth();

useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);
```

### Data Fetching Pattern
```tsx
const [data, setData] = useState([]);

useEffect(() => {
  const fetchedData = getData();
  setData(fetchedData);
}, []);
```

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Component Library**: shadcn/ui