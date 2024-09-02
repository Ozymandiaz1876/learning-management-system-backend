import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsOptional()
  isCorrect?: boolean;
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  questionText?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsOptional()
  options?: OptionDto[];

  @IsInt()
  @IsOptional()
  difficulty?: number;

  @IsOptional()
  createdBy?: string; // Assuming the `createdBy` will be a `User` object or ID
}
