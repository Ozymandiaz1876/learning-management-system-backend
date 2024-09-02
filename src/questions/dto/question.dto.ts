import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

class OptionDto {
  @IsString()
  @IsOptional()
  text?: string;

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
  @IsOptional()
  options?: OptionDto[];
}
