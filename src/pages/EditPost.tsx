import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getPosts, updatePost } from "@/lib/storage";
import { getStoredUser } from "@/lib/auth";
import { Post } from "@/lib/mockData";
import { postSchema, type PostFormData } from "@/lib/validations";
import { ArrowLeft, Loader2 } from "lucide-react";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState(getStoredUser());

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);

    if (!user) {
      navigate("/login");
      return;
    }

    const posts = getPosts();
    const foundPost = posts.find((p) => p.id === id);

    if (foundPost) {
      setPost(foundPost);
      form.reset({
        title: foundPost.title,
        excerpt: foundPost.excerpt,
        content: foundPost.content,
        imageUrl: foundPost.imageUrl || "",
      });
    }
  }, [id, navigate, form]);

  const onSubmit = async (data: PostFormData) => {
    if (!currentUser || !post) return;

    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      updatePost(post.id, {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        imageUrl: data.imageUrl || undefined,
      });

      toast({
        title: "Post updated!",
        description: "Your changes have been saved successfully.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </main>
      </div>
    );
  }

  if (post.authorId !== currentUser.id) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
          <p className="text-muted-foreground mb-4">You can only edit your own posts.</p>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link to="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Edit Post</CardTitle>
              <CardDescription>
                Update your blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your blog title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of your post"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                            label="Post Image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content *</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Write your blog content here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="flex-1"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Post
                    </Button>
                    <Link to="/dashboard" className="flex-1">
                      <Button type="button" variant="outline" size="lg" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EditPost;
