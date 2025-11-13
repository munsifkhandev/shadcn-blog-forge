import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { getCurrentUser } from "@/lib/mockData";

const Navbar = () => {
  const currentUser = getCurrentUser();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            BlogApp
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/blogs">
              <Button variant="ghost">Blogs</Button>
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline">{currentUser.name}</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
