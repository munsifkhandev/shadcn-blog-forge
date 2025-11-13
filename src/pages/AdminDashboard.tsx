import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getPosts, setPosts, getUsers, setUsers } from "@/lib/storage";
import { Post, User } from "@/lib/mockData";
import { logout } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  MoreVertical,
  Pencil,
  Trash2,
  Shield,
  Menu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, isWithinInterval } from "date-fns";

type Page = "overview" | "posts" | "users";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<Page>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [posts, setPosts_] = useState<Post[]>([]);
  const [users, setUsers_] = useState<User[]>([]);

  // Dialog states
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "ADMIN") {
        navigate("/");
        toast({
          title: "Access Denied",
          description: "You must be an admin to access this page.",
          variant: "destructive",
        });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPosts_(getPosts());
    setUsers_(getUsers());
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    setPosts(updatedPosts);
    setPosts_(updatedPosts);
    setDeletePostId(null);
    toast({
      title: "Post Deleted",
      description: "The post has been successfully deleted.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    setUsers(updatedUsers);
    setUsers_(updatedUsers);
    setDeleteUserId(null);
    toast({
      title: "User Deleted",
      description: "The user has been successfully deleted.",
    });
  };

  const handleToggleRole = (userId: string) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, role: u.role === "ADMIN" ? "USER" : "ADMIN" } as User : u
    );
    setUsers(updatedUsers);
    setUsers_(updatedUsers);
    toast({
      title: "Role Updated",
      description: "User role has been successfully updated.",
    });
  };

  const getAuthorName = (authorId: string) => {
    const author = users.find((u) => u.id === authorId);
    return author ? author.name : "Unknown";
  };

  // Calculate posts per day for the last 7 days
  const getPostsPerDay = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = posts.filter((post) => {
        const postDate = new Date(post.createdAt);
        return isWithinInterval(postDate, { start: dayStart, end: dayEnd });
      }).length;

      data.push({
        date: format(day, "MMM dd"),
        posts: count,
      });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={activePage === "overview" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActivePage("overview")}
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            {sidebarOpen && "Overview"}
          </Button>
          <Button
            variant={activePage === "posts" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActivePage("posts")}
          >
            <FileText className="h-5 w-5 mr-2" />
            {sidebarOpen && "Manage Posts"}
          </Button>
          <Button
            variant={activePage === "users" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActivePage("users")}
          >
            <Users className="h-5 w-5 mr-2" />
            {sidebarOpen && "Manage Users"}
          </Button>
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {activePage === "overview" && "Overview"}
              {activePage === "posts" && "Manage Posts"}
              {activePage === "users" && "Manage Users"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activePage === "overview" && "Dashboard statistics and insights"}
              {activePage === "posts" && "View and manage all blog posts"}
              {activePage === "users" && "View and manage all users"}
            </p>
          </div>

          {/* Overview Page */}
          {activePage === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{posts.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {users.filter((u) => u.role === "ADMIN").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Posts per Day (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPostsPerDay()}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Manage Posts Page */}
          {activePage === "posts" && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No posts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{getAuthorName(post.authorId)}</TableCell>
                          <TableCell>{format(new Date(post.createdAt), "MMM dd, yyyy")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => navigate(`/dashboard/edit/${post.id}`)}
                                >
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Manage Users Page */}
          {activePage === "users" && (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === "ADMIN"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleToggleRole(user.id)}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change to {user.role === "ADMIN" ? "User" : "Admin"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeleteUserId(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
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
              onClick={() => deletePostId && handleDeletePost(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
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

export default AdminDashboard;
