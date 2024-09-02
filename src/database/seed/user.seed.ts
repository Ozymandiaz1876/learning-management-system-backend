import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import { UsersService } from '../../users/users.service';

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
      password: 'foo_b@r',
    });
    console.log(user);
  }
}
