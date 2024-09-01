import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRolesEnum } from '../constants/enums/UserRoles.enum';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin Endpoints
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => this.usersService.toUserDto(user));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.findOne(id);
    return this.usersService.toUserDto(user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return this.usersService.toUserDto(user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRolesEnum.ADMIN)
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deletionStatus = await this.usersService.remove(id);
    return { deleted: deletionStatus };
  }

  // User Endpoints
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.toUserDto(user);
  }

  @Post('login')
  loginUser(
    @Body() loginUserDto: { email: string; password: string },
  ): Promise<{ token: string }> {
    return this.usersService.login(loginUserDto);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Param('id') id: string): Promise<UserDto> {
    const me = await this.usersService.findOne(id);
    return this.usersService.toUserDto(me);
  }
}
