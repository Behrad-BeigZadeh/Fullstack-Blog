"use client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/apis/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { AxiosError } from "axios";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuthTokenStore } from "@/stores/tokenStore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useUserStore();
  const { setAccessToken } = useAuthTokenStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: () => login(formData.email, formData.password),
    onSuccess: (data) => {
      toast.success("Logged in successfully!");
      setUser(data.user);
      setAccessToken(data.accessToken);
      router.push("/");
    },
  });

  useEffect(() => {
    if (loginMutation.isError) {
      const error = loginMutation.error as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Login failed");
    }
  }, [loginMutation.isError, loginMutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-950 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-neutral-800"
      >
        <h1 className="text-3xl font-bold text-zinc-100 text-center">Login</h1>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-neutral-400"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
              className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-neutral-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-zinc-100"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-red-500 text-zinc-100 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-neutral-400">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-red-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
