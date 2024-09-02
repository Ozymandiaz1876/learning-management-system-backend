import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserRolesEnum } from 'src/constants/enums';

@Injectable()
export class UserSeed {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'create:user',
    describe: 'create a user',
  })
  async create() {
    const user = await this.userService.create({
      firstName: 'First name',
      lastName: 'Last name',
      email: 'test@test.com',
      role: UserRolesEnum.USER,
      password: 'foo_b@r',
    });
    console.log(user);
  }

  @Command({
    command: 'create:admin',
    describe: 'create an admin',
  })
  async createAdmin() {
    const user = await this.userService.create({
      firstName: 'First name',
      lastName: 'Last name',
      email: 'admin@admin.com',
      password: 'foo_b@r',
      role: UserRolesEnum.ADMIN,
    });
    console.log(user);
  }
}
