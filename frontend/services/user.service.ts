import { PaginatedUsers, User } from "@/types";
import { apiClient } from "./api-client";

export const UserService = {
    getAll: (page: number, limit: number) =>
      apiClient.get<PaginatedUsers>(`/users?page=${page}&limit=${limit}`),
  
    getById: (id: number) =>
      apiClient.get<User>(`/users/${id}`),
  };