import { axiosClient } from "@/api/axiosClient";
import { tokenStorage } from "@/utils/tokenStorage";

export type UserRole = "resident" | "admin" | "worker";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
  role: UserRole;
};

const USER_KEY = "authUser";

function setStoredUser(user: AuthUser | null) {
  try {
    if (!user) localStorage.removeItem(USER_KEY);
    else localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await axiosClient.post<AuthResponse>("/auth/register", data);
    tokenStorage.setToken(res.data.token);
    setStoredUser(res.data.user);
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await axiosClient.post<AuthResponse>("/auth/login", data);
    tokenStorage.setToken(res.data.token);
    setStoredUser(res.data.user);
    return res.data;
  },

  logout() {
    tokenStorage.removeToken();
    setStoredUser(null);
  },
};

