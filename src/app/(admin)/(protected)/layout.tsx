"use client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser, logout } from "@/services/firebaseServices";
import { User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<null | FirebaseUser>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
        setIsLoading(false);
      } catch (error) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            {/* Left section */}
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  Yug Abhiyaan Foundation
                </h1>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">
                  {user?.displayName || "Welcome"}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>

              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Avatar className="h-10 w-10 border-2 border-emerald-100">
                  <AvatarImage
                    src={user?.photoURL || undefined}
                    alt={user?.displayName || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                    {getInitials(user?.displayName || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 bg-gray-50/50">{children}</div>
      </main>
    </SidebarProvider>
  );
}
