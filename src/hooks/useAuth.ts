import { useEffect, useState } from "react";
import { User } from "@/lib/mockData";
import { getStoredUser } from "@/lib/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  return { user, loading };
};
