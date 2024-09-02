import { Injectable } from '@nestjs/common';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { Test } from './tests.model';
import { ObjectId } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { CreateTestDto } from './dto/create-test.dto';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class TestsRepository {
  constructor(
    @InjectModel(Test) private testModel: ReturnModelType<typeof Test>,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async findById(id: string): Promise<Test | null> {
    const objectId = new ObjectId(id);
    return this.testModel.findById(objectId).exec();
  }

  async findByTitle(title: string): Promise<Test | null> {
    return this.testModel.findOne({ title });
  }
  findByUniqueUrlId(uniqueUrlId: string) {
    return this.testModel.findOne({ uniqueUrlId });
  }
  async findAll(): Promise<Test[]> {
    return this.testModel.find().exec();
  }

  async create(test: CreateTestDto): Promise<Test> {
    const testData = {
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
