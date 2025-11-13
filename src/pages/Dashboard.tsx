import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getPosts, deletePost, getUsers, setUsers } from "@/lib/storage";
import { getStoredUser, setStoredUser } from "@/lib/auth";
import { Post, User } from "@/lib/mockData";
import { profileUpdateSchema, passwordChangeSchema, type ProfileUpdateFormData, type PasswordChangeFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, MoreVertical, FileText, Settings, Loader2 } from "lucide-react";
import { format } from "date-fns";

type TabType = "posts" | "settings";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    if (!user) {
      navigate("/login");
      return;
    }

    loadUserPosts(user.id);
  }, [navigate]);

  const loadUserPosts = (userId: string) => {
    const allPosts = getPosts();
    const filtered = allPosts.filter((post) => post.authorId === userId);
    setUserPosts(filtered);
  };

  const handleDelete = (postId: string) => {
    deletePost(postId);
    setUserPosts((prev) => prev.filter((p) => p.id !== postId));
    setDeletePostId(null);
    
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted.",
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your blog and profile settings
              </p>
            </div>
            <Link to="/dashboard/new">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </Link>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
            {/* Left Sidebar Navigation */}
            <aside className="space-y-2">
              <Card className="p-4">
                <nav className="space-y-1">
                  <Button
                    variant={activeTab === "posts" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("posts")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    My Posts
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Button>
                </nav>
              </Card>
            </aside>

            {/* Right Content Area */}
            <div>
              {activeTab === "posts" && (
                <MyPostsSection
                  userPosts={userPosts}
                  deletePostId={deletePostId}
                  setDeletePostId={setDeletePostId}
                  handleDelete={handleDelete}
                />
              )}
              {activeTab === "settings" && (
                <ProfileSettingsSection
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Post Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && handleDelete(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// My Posts Section Component
const MyPostsSection = ({
  userPosts,
  deletePostId,
  setDeletePostId,
  handleDelete,
}: {
  userPosts: Post[];
  deletePostId: string | null;
  setDeletePostId: (id: string | null) => void;
  handleDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userPosts.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {userPosts.length === 1 ? "post" : "posts"} published
          </p>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
          <CardDescription>Manage and edit your blog posts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {userPosts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground text-lg mb-4">
                You haven't created any posts yet.
              </p>
              <Link to="/dashboard/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{format(new Date(post.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/edit/${post.id}`)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Profile Settings Section Component
const ProfileSettingsSection = ({
  currentUser,
  setCurrentUser,
}: {
  currentUser: User;
  setCurrentUser: (user: User) => void;
}) => {
  const { toast } = useToast();

  // Profile Update Form
  const profileForm = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: currentUser.name,
    },
  });

  // Password Change Form
  const passwordForm = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileUpdateFormData) => {
    try {
      // Update user in localStorage
      const users = getUsers();
      const updatedUsers = users.map((u) =>
        u.id === currentUser.id ? { ...u, name: data.name, updatedAt: new Date().toISOString() } : u
      );
      setUsers(updatedUsers);

      // Update current user
      const updatedUser = { ...currentUser, name: data.name };
      setStoredUser(updatedUser);
      setCurrentUser(updatedUser);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    try {
      // Verify current password
      if (currentUser.passwordHash !== data.currentPassword && currentUser.passwordHash !== `hashed_${data.currentPassword}`) {
        toast({
          title: "Error",
          description: "Current password is incorrect.",
          variant: "destructive",
        });
        return;
      }

      // Update password in localStorage
      const users = getUsers();
      const updatedUsers = users.map((u) =>
        u.id === currentUser.id
          ? { ...u, passwordHash: `hashed_${data.newPassword}`, updatedAt: new Date().toISOString() }
          : u
      );
      setUsers(updatedUsers);

      // Reset form
      passwordForm.reset();

      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Update Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input value={currentUser.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <Button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
              >
                {profileForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
