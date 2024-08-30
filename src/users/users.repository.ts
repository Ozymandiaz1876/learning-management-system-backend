import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    const objectId = new ObjectId(id);
    return this.userModel.findById(objectId).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async create(user: User): Promise<User> {
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
