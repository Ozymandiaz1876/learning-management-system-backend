import { Injectable, NotFoundException } from '@nestjs/common';
import { TestResultsRepository } from './results.repository';
import { TestResult } from './results.model';

@Injectable()
export class TestResultsService {
  constructor(private readonly testResultsRepository: TestResultsRepository) {}

  async fetchAllResultsForTest(testId: string): Promise<TestResult[]> {
    const results = await this.testResultsRepository.findByTestId(testId);
    if (!results.length) {
      throw new NotFoundException('No results found for this test');
    }
    return results;
  }

  async create(testResult: Partial<TestResult>): Promise<TestResult> {
    return this.testResultsRepository.create(testResult);
  }

  async update(
    id: string,
    updateData: Partial<TestResult>,
  ): Promise<TestResult | null> {
    const result = await this.testResultsRepository.update(id, updateData);
    if (!result) {
      throw new NotFoundException('Test result not found');
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.testResultsRepository.delete(id);
    if (!result) {
      throw new NotFoundException('Test result not found');
    }
  }
}
