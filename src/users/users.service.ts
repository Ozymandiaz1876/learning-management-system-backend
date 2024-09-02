import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UserRolesEnum, UserStatusEnum } from 'src/constants/enums';
import { UserDto } from './dto/user.dto';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: CreateUserDto): Promise<User> {
    const incomingPayloadClone = { ...user };

    if (!incomingPayloadClone.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { email: 'emailRequired' },
      });
    }

    if (!incomingPayloadClone.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { password: 'passwordRequired' },
      });
    }
    mongoose.set('debug', true);

    // Check if email already exists
    const userObject = await this.usersRepository.findByEmail(
      incomingPayloadClone.email,
    );

    console.log(userObject);

    if (userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { email: 'emailAlreadyExists' },
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    incomingPayloadClone.password = await bcrypt.hash(
      incomingPayloadClone.password,
      salt,
    );
    incomingPayloadClone.status = UserStatusEnum.ACTIVE;

    if (!incomingPayloadClone.role) {
      incomingPayloadClone.role = UserRolesEnum.USER;
    }

    return this.usersRepository.create(incomingPayloadClone);
  }

  // Convert user document to UserDto
  toUserDto(user: User): UserDto {
    return {
      id: user._id?.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, user: UpdateUserDto): Promise<User> {
    const updateUser = await this.usersRepository.update(id, user);
    if (!updateUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updateUser;
  }

  async remove(id: string): Promise<boolean> {
    const deletedUser = await this.usersRepository.delete(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }
}
