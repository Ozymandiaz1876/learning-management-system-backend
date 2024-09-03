import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TestResult } from './results.model';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class TestResultsRepository {
  constructor(
    @InjectModel(TestResult.name)
    private testResultModel: Model<TestResult>,
  ) {}

  async findByTestId(testId: string): Promise<TestResult[]> {
    return this.testResultModel.find({ testId }).populate('userId').exec();
  }

  async findByTestIdAndUserId(
    testId: string,
    userId: string,
  ): Promise<TestResult | null> {
    return this.testResultModel
      .findOne({
        testId: new mongoose.Types.ObjectId(testId),
        userId: new mongoose.Types.ObjectId(userId),
      })
      .exec();
  }

  async create(testResult: Partial<TestResult>): Promise<TestResult> {
    return this.testResultModel.create(testResult);
  }

  async update(
    id: string,
    updateData: Partial<TestResult>,
  ): Promise<TestResult | null> {
    return this.testResultModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<TestResult | null> {
    return this.testResultModel.findByIdAndDelete(id).exec();
  }
}
