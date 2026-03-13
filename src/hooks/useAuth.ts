import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, getStoredUser, type AuthResponse, type LoginPayload, type RegisterPayload } from "@/api/authService";

const AUTH_USER_KEY = ["auth", "user"];

export function useAuthUser() {
  return getStoredUser();
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_USER_KEY, data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (data) => authService.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_USER_KEY, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    authService.logout();
    queryClient.removeQueries({ queryKey: AUTH_USER_KEY });
  };
}

