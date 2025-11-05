"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  getCurrentUser,
  signin,
  signInWithGoogle,
} from "@/services/firebaseServices";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (email.trim() === "" || password.trim() === "") {
        setError("Please fill in all fields");
        return;
      }
      setLoading(true);
      setError(null);
      const userCredential = await signin(email, password);
      console.log("Login successful:", userCredential);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error signing in:", error);
      let errorMessage = "An error occurred during login";
      const maybe = error as { code?: string } | undefined;
      if (maybe?.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (maybe?.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (maybe?.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (maybe?.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        console.log("User is already logged in:", user);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    setError(null);
                    await signInWithGoogle();
                    // redirect after successful Google sign-in
                    router.push("/dashboard");
                  } catch (err) {
                    console.error("Google sign-in error:", err);
                    setError("Google sign-in failed. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Login with Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
