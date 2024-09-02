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
import mongoose from 'mongoose';
import { QuestionsService } from 'src/questions/questions.service';
import { StartTestDto } from './dto/start-test.dto';
import { QuestionDto } from 'src/questions/dto/question.dto';
import { SubmitTestAnswerDto } from './dto/submit-question-dto';
import { TestResponse, TestResult } from 'src/results/results.model';
import { SubmitQuestionResponseDto } from './dto/submit-question-response-dto';

@Injectable()
export class TestsService {
  constructor(
    private readonly testsRepository: TestsRepository,
    private readonly testResultsRepository: TestResultsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(createTestDto: CreateTestDto): Promise<Test> {
    console.log(createTestDto);

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

  async startTest(testData: StartTestDto): Promise<QuestionDto> {
    const { userId, testId } = testData;
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

    await this.testResultsRepository.create({
      testId: new mongoose.Types.ObjectId(testId),
      userId: new mongoose.Types.ObjectId(userId),
      score: 0,
      completed: false,
      responses: [],
      dateTaken: new Date(),
    });

    const questions = await this.questionsService.findByDifficulty(
      test.adaptiveAlgorithm.initialDifficulty,
      false,
      1,
    );

    if (!questions.length) {
      throw new NotFoundException('No questions found for this test');
    }
    return questions[0];
  }

  async submitAnswer(
    SubmitTestAnswerDto: SubmitTestAnswerDto,
  ): Promise<SubmitQuestionResponseDto> {
    const { userId, testId, questionId, answer } = SubmitTestAnswerDto;
    // Fetch the test details
    const test = await this.findOne(testId);

    // Validate the question belongs to the test
    const question = await this.questionsService.findOne(questionId, true);
    if (!test || !question) {
      throw new NotFoundException('Test or question not found');
    }

    // Check if the answer is correct
    const isCorrect = question.options.some(
      (option) => option.text === answer && option.isCorrect,
    );

    // Fetch the user's current test result
    const testResult = await this.testResultsRepository.findByTestIdAndUserId(
      testId,
      userId,
    );
    if (!testResult) {
      throw new NotFoundException('Test result not found');
    }

    // Update the test result with the user's response
    const updatedResponses: TestResponse[] = [
      ...testResult.responses,
      {
        questionId: new mongoose.Types.ObjectId(questionId),
        answer,
        correct: isCorrect,
      },
    ];

    const updatedTestData: Partial<TestResult> = {
      responses: updatedResponses,
      score: testResult.score + (isCorrect ? 1 : 0),
    };

    const consecutiveCorrectAnswers = updatedResponses.reduce(
      (count, response) => {
        return response.correct ? count + 1 : 0;
      },
      0,
    );

    // Check if the test is completed
    if (
      updatedResponses.length >= test.adaptiveAlgorithm.maxQuestions ||
      consecutiveCorrectAnswers >=
        test.adaptiveAlgorithm.consecutiveCorrectToEnd
    ) {
      updatedTestData.completed = true;
    }

    await this.testResultsRepository.update(
      testResult._id.toString(),
      updatedTestData,
    );

    if (updatedTestData.completed) {
      return {
        message: 'Test completed',
        score: updatedTestData.score,
      };
    }

    // Adjust the difficulty based on the adaptive algorithm
    let newDifficulty = test.adaptiveAlgorithm.initialDifficulty;
    if (isCorrect) {
      newDifficulty += test.adaptiveAlgorithm.correctAdjustment;
    } else {
      newDifficulty -= test.adaptiveAlgorithm.incorrectAdjustment;
    }

    // Ensure the difficulty stays within bounds
    newDifficulty = Math.max(
      test.adaptiveAlgorithm.minDifficulty,
      Math.min(newDifficulty, test.adaptiveAlgorithm.maxDifficulty),
    );

    // Determine the next question based on the new difficulty
    const nextQuestion = await this.questionsService.findByDifficulty(
      newDifficulty,
      false,
      1,
    );

    // If no next question is found or the test is completed, return the test result
    if (!nextQuestion.length) {
      return {
        message: 'Test completed',
        score: updatedTestData.score,
      };
    }

    return { message: 'Next question', question: nextQuestion[0] };
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
