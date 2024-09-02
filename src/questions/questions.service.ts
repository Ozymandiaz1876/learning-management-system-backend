import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './questions.repository';
import { CreateQuestionDto, OptionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './questions.model';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newlyCreatedQuestion =
      await this.questionsRepository.create(createQuestionDto);
    return newlyCreatedQuestion;
  }

  async findAll(): Promise<Question[]> {
    return this.questionsRepository.findAll();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionsRepository.findById(id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updateQuestion = await this.questionsRepository.update(
      id,
      updateQuestionDto,
    );
    if (!updateQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return updateQuestion;
  }

  async remove(id: string): Promise<boolean> {
    const deletedQuestion = await this.questionsRepository.delete(id);
    return !!deletedQuestion;
  }
  toQuestionDto(question: Question): QuestionDto {
    const { _id, questionText, options, difficulty } = question;

    const optionsDto: OptionDto[] = options.map((option) => ({
      text: option.text,
      isCorrect: option.isCorrect,
    }));

    return {
      id: _id.toString(),
      questionText,
      options: optionsDto,
      difficulty,
    };
  }
}
