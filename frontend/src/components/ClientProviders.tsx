"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";
const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  useAuthInitializer();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  );
}
