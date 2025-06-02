import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

export const useAuthInitializer = () => {
  const { setAccessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        setAccessToken(data.accessToken);
        setUser(data.user);

        console.log(" Session restored from refresh token");
      } catch (err) {
        logout();
        console.log(" No valid session", err);
      }
    };

    tryRefresh();
  }, []);
};
