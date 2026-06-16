import { Role } from '@prisma/client';

export class UserResponseDto {
  id: number;
  name: string;
  age: number;
  hkid: string; // Masked or full, depends on role
  role: Role;
  email: string;
  createdAt: Date;
}
