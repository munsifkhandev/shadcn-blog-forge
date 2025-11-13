import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Welcome to <span className="text-primary">BlogApp</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Discover amazing stories, insights, and ideas from talented writers around the world.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/blogs">
              <Button size="lg" className="text-lg px-8">
                Explore Blogs
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Start Writing
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-2xl font-semibold mb-2">📚 Rich Content</h3>
              <p className="text-muted-foreground">
                Create and share beautifully formatted blog posts with images and markdown support.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-2xl font-semibold mb-2">✍️ Easy Publishing</h3>
              <p className="text-muted-foreground">
                Intuitive dashboard to manage all your blog posts in one place.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-2xl font-semibold mb-2">🎨 Beautiful Design</h3>
              <p className="text-muted-foreground">
                Clean and modern interface built with the latest design principles.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
