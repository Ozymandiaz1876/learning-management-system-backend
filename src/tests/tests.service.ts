import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './tests.model';
import { TestsRepository } from './tests.repository';
import { TestResultsRepository } from 'src/results/results.repository';
import { UsersRepository } from 'src/users/users.repository';
import { TestResult } from 'src/results/results.model';
import mongoose from 'mongoose';

@Injectable()
export class TestsService {
  constructor(
    private readonly testsRepository: TestsRepository,
    private readonly testResultsRepository: TestResultsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const existingTest = await this.testsRepository.findByTitle(
      createTestDto.title,
    );
    if (existingTest) {
      throw new UnprocessableEntityException(
        'Test with this title already exists',
      );
    }
    return this.testsRepository.create(createTestDto);
  }

  async findAll(): Promise<Test[]> {
    return this.testsRepository.findAll();
  }

  async startTest(userId: string, testId: string): Promise<TestResult> {
    // Validate testId
    const test = await this.testsRepository.findById(testId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    // Validate userId
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if test has already started
    const existingResult =
      await this.testResultsRepository.findByTestIdAndUserId(testId, userId);
    if (existingResult) {
      throw new UnprocessableEntityException('Test already started');
    }

    // Create a new test result
    const testResult = await this.testResultsRepository.create({
      testId: new mongoose.Types.ObjectId(testId),
      userId: new mongoose.Types.ObjectId(userId),
      score: 0,
      completed: false,
      responses: [],
      dateTaken: new Date(),
    });

    return testResult;
  }

  getTestDataByUniqueUrlId(uniqueUrlId: string) {
    const test = this.testsRepository.findByUniqueUrlId(uniqueUrlId);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  async findOne(id: string): Promise<Test | null> {
    const test = await this.testsRepository.findById(id);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto): Promise<Test | null> {
    const test = await this.testsRepository.update(id, updateTestDto);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  async remove(id: string): Promise<void> {
    const result = await this.testsRepository.delete(id);
    if (!result) {
      throw new NotFoundException('Test not found');
    }
  }
}
