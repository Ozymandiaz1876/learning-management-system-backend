import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsRepository } from './questions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionModelSchema } from './questions.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionModelSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsRepository],
  exports: [QuestionsService],
})
export class QuestionsModule {}
