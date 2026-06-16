import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    name: true,
    age: true,
    hkid: true,
    role: true,
    email: true,
    createdAt: true,
  };

  // e.g. A1234567 → A****56(7)
  private maskHkid(hkid: string): string {
    if (hkid.length <= 4) return '****';
    return `${hkid[0]}${'*'.repeat(hkid.length - 4)}${hkid.slice(-5)}`;
  }

  // Get all users with pagination
  async findAll(page: number = 1, limit: number = 10, requesterRole: Role): Promise<PaginatedUsersResponseDto>  {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          select: this.userSelect,
          orderBy: { id: 'asc' },
        }),
        this.prisma.user.count(),
      ]);

      const isAdmin = requesterRole === Role.ADMIN;
      const data = users.map((user) => ({
        ...user,
        hkid: isAdmin ? user.hkid : this.maskHkid(user.hkid),
      }));
      
      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
      };
  }

  async findOne(id: number, requesterRole: Role): Promise<UserResponseDto>  {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    
    return {
      ...user,
      hkid: requesterRole === Role.ADMIN ? user.hkid : this.maskHkid(user.hkid),
    };
  }

  // For Auth (needs password)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }


}
