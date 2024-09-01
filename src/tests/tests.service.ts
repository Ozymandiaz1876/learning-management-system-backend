import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './tests.model';
import { TestsRepository } from './tests.repository';

@Injectable()
export class TestsService {
  constructor(private readonly testsRepository: TestsRepository) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    const existingTest = await this.testsRepository.findByUniqueUrlId(
      createTestDto.uniqueUrlId,
    );
    if (existingTest) {
      throw new UnprocessableEntityException(
        'Test with this URL already exists',
      );
    }
    return this.testsRepository.create(createTestDto);
  }

  async findAll(): Promise<Test[]> {
    return this.testsRepository.findAll();
  }

  async findOne(id: string): Promise<Test | null> {
    const test = await this.testsRepository.findById(id);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  async findByUniqueUrlId(uniqueUrlId: string): Promise<Test | null> {
    const test = await this.testsRepository.findByUniqueUrlId(uniqueUrlId);
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
