"use client";
import { logoutUser } from "@/apis/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAuthPage = pathname.startsWith("/auth");
  const isCreatePage = pathname.startsWith("/posts/create");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      toast.success("Logged out successfully!");
    },
  });

  useEffect(() => {
    if (logoutMutation.isError) {
      const error = logoutMutation.error as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }, [logoutMutation.isError, logoutMutation.error]);

  const handleLogout = () => {
    logoutMutation.mutate();
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav
      className={` relative py-4 px-6 flex justify-between items-center transition-all duration-300 ${
        isAuthPage || isCreatePage
          ? "bg-zinc-950 border-b border-zinc-800 text-red-500"
          : "bg-zinc-100 border-b border-b-zinc-300 text-zinc-900"
      }`}
    >
      <Link href="/" className="text-3xl font-bold italic tracking-widest">
        MyBlog
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex space-x-4 text-sm font-medium items-center">
        {user && (
          <Link href="/posts/userPosts" className="hover:underline">
            My Posts
          </Link>
        )}
        <Link href="/posts/create" className="hover:underline">
          Create
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
          >
            Logout
          </button>
        ) : (
          <div className="flex items-center  space-x-2">
            <Link href="/auth/signup" className="hover:underline">
              Signup
            </Link>
            <p>/</p>
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} aria-label="Menu Toggle">
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div
          className={`absolute top-full left-0 w-full  bg-white shadow-md z-50 flex flex-col justify-center text-center gap-4 px-6 py-4 text-sm font-medium md:hidden ${
            isAuthPage || isCreatePage
              ? "bg-zinc-950 text-red-500"
              : "bg-white text-zinc-900"
          }`}
        >
          {user && (
            <Link
              href="/posts/userPosts"
              className="hover:underline"
              onClick={toggleMobileMenu}
            >
              My Posts
            </Link>
          )}
          <Link
            href="/posts/create"
            className="hover:underline"
            onClick={toggleMobileMenu}
          >
            Create
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/signup"
                className="hover:underline"
                onClick={toggleMobileMenu}
              >
                Signup
              </Link>
              <Link
                href="/auth/login"
                className="hover:underline"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
