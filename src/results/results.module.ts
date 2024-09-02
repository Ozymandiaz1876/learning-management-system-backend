import { Module } from '@nestjs/common';
import { TestResultsRepository } from './results.repository';
import { TestResult, TestResultModelSchema } from './results.model';
import { TestResultsService } from './results.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestResult.name, schema: TestResultModelSchema },
    ]),
  ],
  providers: [TestResultsRepository, TestResultsService],
  exports: [TestResultsRepository, TestResultsService],
})
export class ResultsModule {}
