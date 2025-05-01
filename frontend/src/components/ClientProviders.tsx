"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useRefreshToken } from "@/hooks/useRefreshToken";

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
  useRefreshToken();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      {children}
    </QueryClientProvider>
  );
}
