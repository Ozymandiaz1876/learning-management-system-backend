import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OptionDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsBoolean()
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
  createdBy!: string;
}
