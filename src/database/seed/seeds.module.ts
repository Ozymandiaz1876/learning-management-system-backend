import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserSeed } from './user.seed';
import { UsersModule } from 'src/users/users.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { TestsModule } from 'src/tests/tests.module';
import { QuestionsSeed } from './questions.seed';
import { TestSeed } from './test.seed';

@Module({
  imports: [CommandModule, UsersModule, QuestionsModule, TestsModule],
  providers: [UserSeed, QuestionsSeed, TestSeed],
  exports: [UserSeed, QuestionsSeed, TestSeed],
})
export class SeedsModule {}
