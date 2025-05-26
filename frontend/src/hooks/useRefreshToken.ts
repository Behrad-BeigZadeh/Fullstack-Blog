"use client";

import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { logoutUser } from "@/apis/api";

export const useRefreshToken = () => {
  const { setAccessToken, setUser, logout, accessToken } = useAuthStore();

  useEffect(() => {
    const refresh = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/refresh-token`,
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        setUser(data.user);
        console.log("✅ Token refreshed");
      } catch (err) {
        console.error("Refresh token failed", err);
        await logoutUser();
        logout();
      }
    };

    // Run once on mount

    if (!accessToken) {
      refresh();
    }

    // Also run every 14 minutes
    const interval = setInterval(refresh, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setAccessToken, setUser, logout, accessToken]);
};
