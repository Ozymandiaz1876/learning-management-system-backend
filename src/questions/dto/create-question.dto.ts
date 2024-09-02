import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../users/users.model';

export class OptionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsNotEmpty()
  isCorrect!: boolean;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options!: OptionDto[];

  @IsInt()
  @IsNotEmpty()
  difficulty!: number;

  @IsNotEmpty()
  createdBy!: User; // Assuming the `createdBy` will be a `User` object or ID
}
