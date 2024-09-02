import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { TestsService } from 'src/tests/tests.service';

@Injectable()
export class TestSeed {
  constructor(private readonly testService: TestsService) {}

  @Command({
    command: 'create:test',
    describe: 'seed test data',
  })
  async create() {
    const test = await this.testService.create({
      title: 'Test',
      description: 'Test description',
      createdBy: '66d5a135cea5fb5c13091b3c',
    });
    console.log(test);
  }
}
