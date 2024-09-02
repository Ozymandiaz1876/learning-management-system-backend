import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { ObjectId } from 'mongodb';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const objectId = new ObjectId(id);
    return this.userModel.findById(objectId).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: CreateUserDto): Promise<User> {
    return this.userModel.create(user);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const objectId = new ObjectId(id);
    return this.userModel.findByIdAndUpdate(objectId, user, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<User | null> {
    const objectId = new ObjectId(id);
    return this.userModel.findByIdAndDelete(objectId);
  }
}
