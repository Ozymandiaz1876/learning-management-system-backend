import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from 'src/validators/config.validator';
import { TestAlgorithmConfig } from './testAlgorithm-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  ALGO_INITIAL_DIFIFICULTY: string;

  @IsString()
  @IsOptional()
  ALGO_DIFFICULTY_INCREMENT: string;

  @IsString()
  @IsOptional()
  ALGO_DIFFICULTY_DECREMENT: string;

  @IsString()
  @IsOptional()
  ALGO_MAX_QUESTIONS: string;

  @IsString()
  @IsOptional()
  ALGO_MAX_DIFICULTY: string;

  @IsString()
  @IsOptional()
  ALGO_MIN_DIFICULTY: string;

  @IsString()
  @IsOptional()
  ALGO_CONSECUTIVE_CORRECT_ANSWERS: string;
}

export default registerAs<TestAlgorithmConfig>('testAlgorithm', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    initialDifficulty: Number(process.env.ALGO_INITIAL_DIFIFICULTY) || 5,
    correctAdjustment: Number(process.env.ALGO_DIFFICULTY_INCREMENT) || 1,
    incorrectAdjustment: Number(process.env.ALGO_DIFFICULTY_DECREMENT) || 1,
    maxQuestions: Number(process.env.ALGO_MAX_QUESTIONS) || 20,
    maxDifficulty: Number(process.env.ALGO_MAX_DIFICULTY) || 10,
    minDifficulty: Number(process.env.ALGO_MIN_DIFICULTY) || 1,
    consecutiveCorrectToEnd:
      Number(process.env.ALGO_CONSECUTIVE_CORRECT_ANSWERS) || 3,
  };
});
