import { useEffect } from "react";
import axios from "axios";
import { useAuthTokenStore } from "@/stores/tokenStore";
import { useUserStore } from "@/stores/userStore";
import { handleLogout } from "@/apis/api";

export const useAuthInitializer = () => {
  const { setUser, logoutUser, setHasHydrated } = useUserStore();
  const { setAccessToken, logoutToken } = useAuthTokenStore();

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
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          await handleLogout();
          logoutUser();
          logoutToken();
        }
      } finally {
        setHasHydrated(true);
      }
    };

    tryRefresh();
  }, []);
};
