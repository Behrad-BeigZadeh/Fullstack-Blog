import { logoutUser } from "@/apis/api";
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.request.use(async (config) => {
  const { accessToken, setAccessToken, setUser, logout } =
    useAuthStore.getState();

  if (!accessToken) return config;

  try {
    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    const now = Date.now() / 1000;

    if (exp - now < 60 && !isRefreshing) {
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        setAccessToken(data.accessToken);
        setUser(data.user);
        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            await logoutUser();

            logout();
          } else {
            console.warn(
              "Server issue or network error, not logging out immediately."
            );
          }
        }
      } finally {
        isRefreshing = false;
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch (err) {
    console.error("Failed to decode token or refresh", err);
    return config;
  }
});

export default api;
