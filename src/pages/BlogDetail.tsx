import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { mockPosts, mockUsers } from "@/lib/mockData";
import { ArrowLeft } from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams();
  const post = mockPosts.find((p) => p.slug === slug);
  const author = post ? mockUsers.find((u) => u.id === post.authorId) : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
          <Link to="/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto space-y-8">
          <Link to="/blogs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Button>
          </Link>
          
          {post.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {author?.name}</span>
              <span>•</span>
              <time>{new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
