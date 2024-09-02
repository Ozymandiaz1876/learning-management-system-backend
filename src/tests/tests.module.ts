import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { TestsRepository } from './tests.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsModule } from 'src/results/results.module';
import { UsersModule } from 'src/users/users.module';
import { Test, TestModelSchema } from './tests.model';

@Module({
  imports: [
    ResultsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Test.name, schema: TestModelSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService, TestsRepository],
  exports: [TestsService],
})
export class TestsModule {}
