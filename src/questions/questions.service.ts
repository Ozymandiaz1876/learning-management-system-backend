import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './questions.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './questions.model';
import { QuestionDto, OptionDto } from './dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    includeAnswer = false,
  ): Promise<QuestionDto> {
    const newlyCreatedQuestion =
      await this.questionsRepository.create(createQuestionDto);
    return this.toQuestionDto(newlyCreatedQuestion, includeAnswer);
  }

  async createMany(
    questionsToInsert: CreateQuestionDto[],
    includeAnswer = false,
  ): Promise<QuestionDto[]> {
    const questions =
      await this.questionsRepository.createMany(questionsToInsert);
    return questions.map((question) =>
      this.toQuestionDto(question, includeAnswer),
    );
  }

  async findAll(includeAnswer = false): Promise<QuestionDto[]> {
    const questions = await this.questionsRepository.findAll();
    return questions.map((question) =>
      this.toQuestionDto(question, includeAnswer),
    );
  }

  async findOne(id: string, includeAnswer = false): Promise<QuestionDto> {
    const question = await this.questionsRepository.findById(id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return this.toQuestionDto(question, includeAnswer);
  }

  async findByDifficulty(
    difficulty: number,
    includeAnswer = false,
    amount?: number,
  ): Promise<QuestionDto[]> {
    const questions =
      await this.questionsRepository.findByDifficulty(difficulty);

    if (!questions.length) {
      throw new NotFoundException(
        `Questions with difficulty ${difficulty} not found`,
      );
    }
    if (amount) {
      return questions
        .slice(0, amount)
        .map((q) => this.toQuestionDto(q, includeAnswer));
    }
    return questions.map((q) => this.toQuestionDto(q, includeAnswer));
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    includeAnswer = false,
  ): Promise<QuestionDto> {
    const updateQuestion = await this.questionsRepository.update(
      id,
      updateQuestionDto,
    );
    if (!updateQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return this.toQuestionDto(updateQuestion, includeAnswer);
  }

  async remove(id: string): Promise<boolean> {
    const deletedQuestion = await this.questionsRepository.delete(id);
    return !!deletedQuestion;
  }
  toQuestionDto(question: Question, includeAnswer = false): QuestionDto {
    const { _id, questionText, options, difficulty } = question;

    const optionsDto: OptionDto[] = options.map((option) => ({
      text: option.text,
      ...(includeAnswer ? { isCorrect: option.isCorrect } : {}),
    }));

    return {
      id: _id.toString(),
      questionText,
      options: optionsDto,
      difficulty,
    };
  }
}
