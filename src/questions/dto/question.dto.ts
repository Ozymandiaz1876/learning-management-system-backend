import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class OptionDto {
  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  isCorrect?: boolean;
}

export class QuestionDto {
  @IsString()
  public id: string;

  @IsString()
  public questionText: string;

  @IsNumber()
  public difficulty: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
