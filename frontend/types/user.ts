import { Role } from './role';

export interface User {
    id: number;
    name: string;
    age: number;
    hkid: string;
    role: Role;
    email: string;
    createdAt: string;
  }
  
  export interface PaginatedUsers {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: User[];
  }
  