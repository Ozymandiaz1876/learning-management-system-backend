import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UserRolesEnum, UserStatusEnum } from 'src/constants/enums';
import { LoginUserDto } from './dto/login-user.dto';
import { UserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const incomingPayloadClone = { ...user };

    // Check if email already exists
    const userObject = await this.usersRepository.findByEmail(
      incomingPayloadClone.email,
    );
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

  async login(userData: LoginUserDto): Promise<{ token: string }> {
    const user = await this.usersRepository.findByEmail(userData.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
