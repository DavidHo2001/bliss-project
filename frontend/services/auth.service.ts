import { LoginResponse } from "@/types";
import { apiClient } from "./api-client";

export const AuthService = {
    login: (email: string, password: string) =>
      apiClient.post<LoginResponse>('/auth/login', { email, password }),
                                     
  };