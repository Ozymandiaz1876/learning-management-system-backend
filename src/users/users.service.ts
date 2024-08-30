import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UserRolesEnum, UserStatusEnum } from 'src/constants/enums';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: CreateUserDto): Promise<User> {
    const incomingPayloadClone = {
      ...user,
    };

    // hash password
    if (incomingPayloadClone.password) {
      const salt = await bcrypt.genSalt();
      incomingPayloadClone.password = await bcrypt.hash(
        incomingPayloadClone.password,
        salt,
      );
    }

    // check if email already exists
    if (incomingPayloadClone.email) {
      const userObject = await this.usersRepository.findByEmail(
        incomingPayloadClone.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    incomingPayloadClone.status = UserStatusEnum.ACTIVE;

    if (!incomingPayloadClone.role) {
      incomingPayloadClone.role = UserRolesEnum.USER;
    }

    return this.usersRepository.create(incomingPayloadClone);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  update(id: string, user: UpdateUserDto): Promise<User | null> {
    return this.usersRepository.update(id, user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
