import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getPosts, setPosts, getUsers, setUsers, getTopics, setTopics, addTopic, updateTopic, deleteTopic } from "@/lib/storage";
import { Post, User, Topic } from "@/lib/mockData";
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
  Tag,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, isWithinInterval } from "date-fns";

type Page = "overview" | "posts" | "users" | "topics";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<Page>("overview");

  // Data states
  const [posts, setPosts_] = useState<Post[]>([]);
  const [users, setUsers_] = useState<User[]>([]);
  const [topics, setTopics_] = useState<Topic[]>([]);

  // Dialog states
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);
  const [editTopicDialog, setEditTopicDialog] = useState<{ open: boolean; topic: Topic | null }>({ open: false, topic: null });
  
  // Topic form states
  const [newTopicName, setNewTopicName] = useState("");
  const [editTopicName, setEditTopicName] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page.",
        variant: "destructive",
      });
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPosts_(getPosts());
    setUsers_(getUsers());
    setTopics_(getTopics());
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

  const handleTogglePostStatus = (postId: string) => {
    const updatedPosts = posts.map((p) =>
      p.id === postId ? { ...p, status: (p.status === "published" ? "draft" : "published") as "draft" | "published" } : p
    );
    setPosts(updatedPosts);
    setPosts_(updatedPosts);
    toast({
      title: "Status Updated",
      description: "Post status has been successfully updated.",
    });
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim()) {
      toast({
        title: "Error",
        description: "Topic name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const slug = newTopicName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName,
      slug,
    };

    addTopic(newTopic);
    setTopics_([...topics, newTopic]);
    setNewTopicName("");
    toast({
      title: "Topic Created",
      description: "The topic has been successfully created.",
    });
  };

  const handleUpdateTopic = () => {
    if (!editTopicDialog.topic || !editTopicName.trim()) {
      toast({
        title: "Error",
        description: "Topic name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const slug = editTopicName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    updateTopic(editTopicDialog.topic.id, { name: editTopicName, slug });
    setTopics_(topics.map(t => t.id === editTopicDialog.topic!.id ? { ...t, name: editTopicName, slug } : t));
    setEditTopicDialog({ open: false, topic: null });
    setEditTopicName("");
    toast({
      title: "Topic Updated",
      description: "The topic has been successfully updated.",
    });
  };

  const handleDeleteTopic = (topicId: string) => {
    deleteTopic(topicId);
    setTopics_(topics.filter(t => t.id !== topicId));
    setDeleteTopicId(null);
    toast({
      title: "Topic Deleted",
      description: "The topic has been successfully deleted.",
    });
  };

  const getAuthorName = (authorId: string) => {
    const author = users.find((u) => u.id === authorId);
    return author ? author.name : "Unknown";
  };

  const getTopicName = (topicId?: string) => {
    if (!topicId) return "Uncategorized";
    const topic = topics.find((t) => t.id === topicId);
    return topic ? topic.name : "Uncategorized";
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-muted/30 border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            <Button
              variant={activePage === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActivePage("overview")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activePage === "posts" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActivePage("posts")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Manage Posts
            </Button>
            <Button
              variant={activePage === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActivePage("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button
              variant={activePage === "topics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActivePage("topics")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Manage Topics
            </Button>
          </nav>

          <div className="mt-auto pt-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold">
              {activePage === "overview" && "Dashboard Overview"}
              {activePage === "posts" && "Manage Posts"}
              {activePage === "users" && "Manage Users"}
              {activePage === "topics" && "Manage Topics"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activePage === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
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
                    <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{topics.length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Posts Activity (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPostsPerDay()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="posts" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {activePage === "posts" && (
            <Card>
              <CardHeader>
                <CardTitle>All Posts</CardTitle>
                <CardDescription>Manage all blog posts in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">SN</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post, index) => (
                      <TableRow key={post.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{getAuthorName(post.authorId)}</TableCell>
                        <TableCell>{getTopicName(post.topicId)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={post.status === "published"}
                              onCheckedChange={() => handleTogglePostStatus(post.id)}
                            />
                            <span className="text-sm">{post.status === "published" ? "Published" : "Draft"}</span>
                          </div>
                        </TableCell>
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
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletePostId(post.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activePage === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
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
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              u.role === "ADMIN"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {u.role}
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
                              <DropdownMenuItem onClick={() => handleToggleRole(u.id)}>
                                <Shield className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteUserId(u.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activePage === "topics" && (
            <div className="space-y-6">
              {/* Create Topic */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Topic</CardTitle>
                  <CardDescription>Add a new category for blog posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter topic name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTopic();
                        }
                      }}
                    />
                    <Button onClick={handleAddTopic}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Topics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Topics</CardTitle>
                  <CardDescription>Manage blog post categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topics.map((topic) => (
                        <TableRow key={topic.id}>
                          <TableCell className="font-medium">{topic.name}</TableCell>
                          <TableCell className="text-muted-foreground">{topic.slug}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditTopicDialog({ open: true, topic });
                                    setEditTopicName(topic.name);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeleteTopicId(topic.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Delete Post Dialog */}
      <AlertDialog open={deletePostId !== null} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletePostId && handleDeletePost(deletePostId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Topic Dialog */}
      <AlertDialog open={deleteTopicId !== null} onOpenChange={() => setDeleteTopicId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the topic. Posts with this topic will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTopicId && handleDeleteTopic(deleteTopicId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Topic Dialog */}
      <Dialog open={editTopicDialog.open} onOpenChange={(open) => setEditTopicDialog({ open, topic: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Topic</DialogTitle>
            <DialogDescription>Update the topic name</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Topic name"
              value={editTopicName}
              onChange={(e) => setEditTopicName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateTopic();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTopicDialog({ open: false, topic: null })}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTopic}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
