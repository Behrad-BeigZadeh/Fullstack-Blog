"use client";
import { signup } from "@/apis/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUser, setAccessToken } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: () =>
      signup(formData.username, formData.email, formData.password),
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      setUser(data.user);
      setAccessToken(data.accessToken);
      router.push("/");
    },
  });

  useEffect(() => {
    if (signupMutation.isError) {
      const error = signupMutation.error as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "signup failed");
    }
  }, [signupMutation.isError, signupMutation.error]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <form
        className="bg-zinc-950 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-neutral-800"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-zinc-100 text-center">
          Create Account
        </h1>
        <div className="space-y-3">
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Username"
            className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-neutral-400"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Confirm Password"
              className="w-full p-3 bg-neutral-800 text-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-neutral-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-zinc-100"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="w-full bg-red-500 text-zinc-100 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          {signupMutation.isPending ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-sm text-center text-neutral-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-red-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
