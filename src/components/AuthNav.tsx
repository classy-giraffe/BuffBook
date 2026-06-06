import { useEffect, useState } from "react";
import { UserNav } from "./UserNav";
import { authClient } from "../lib/auth-client";
import { LogIn } from "lucide-react";

export function AuthNav() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />;
  }

  if (user) {
    return <UserNav user={user} />;
  }

  return (
    <a
      href="/login"
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </a>
  );
}
