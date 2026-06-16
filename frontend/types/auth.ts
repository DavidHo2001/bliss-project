import { Role } from './role';

export interface LoginResponse {
    access_token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: Role;
    };
  }