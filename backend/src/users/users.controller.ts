import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtUser } from '../auth/interfaces/jwt-payload.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: { user: JwtUser },
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(Number(page), Number(limit), req.user.role);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: { user: JwtUser }): Promise<UserResponseDto> {
    return this.usersService.findOne(id, req.user.role);
  }
}
