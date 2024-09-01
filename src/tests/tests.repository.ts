import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Test } from './tests.model';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { CreateTestDto } from './dto/create-test.dto';

@Injectable()
export class TestsRepository {
  constructor(
    @InjectModel('Test') private testModel: Model<Test>,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async findById(id: string): Promise<Test | null> {
    const objectId = new ObjectId(id);
    return this.testModel.findById(objectId).exec();
  }

  async findByUniqueUrlId(uniqueUrlId: string): Promise<Test | null> {
    return this.testModel.findOne({ uniqueUrlId }).exec();
  }

  async findAll(): Promise<Test[]> {
    return this.testModel.find().exec();
  }

  async create(test: CreateTestDto): Promise<Test> {
    const testData: Test = {
      ...test,
      adaptiveAlgorithm: this.configService.getOrThrow('testAlgorithm', {
        infer: true,
      }),
    };
    return this.testModel.create(testData);
  }

  async update(id: string, test: Partial<Test>): Promise<Test | null> {
    const objectId = new ObjectId(id);
    return this.testModel
      .findByIdAndUpdate(objectId, test, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async delete(id: string): Promise<Test | null> {
    const objectId = new ObjectId(id);
    return this.testModel.findByIdAndDelete(objectId).exec();
  }
}
