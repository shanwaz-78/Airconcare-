import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthMiddleware } from '../auth/guards/auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role';

@Controller('users')
@UseGuards(AuthMiddleware)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @UseGuards(RoleGuard)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
