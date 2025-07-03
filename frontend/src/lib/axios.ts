import { handleLogout } from "@/apis/api";
import { useAuthTokenStore } from "@/stores/tokenStore";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(async (config) => {
  const { setUser, logoutUser } = useUserStore.getState();
  const { accessToken, setAccessToken, logoutToken } =
    useAuthTokenStore.getState();

  if (!accessToken) return config;

  try {
    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    const now = Date.now() / 1000;

    if (exp - now < 60) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .post(
            `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          )
          .then(({ data }) => {
            setAccessToken(data.accessToken);
            setUser(data.user);
            return data.accessToken;
          })
          .catch(async (err) => {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
              await handleLogout();
              logoutUser();
              logoutToken();
            }
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  } catch {
    return config;
  }
});

export default api;
