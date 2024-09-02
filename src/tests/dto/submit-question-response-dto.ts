import { IsString, IsOptional } from 'class-validator';
import { QuestionDto } from 'src/questions/dto/question.dto';

export class SubmitQuestionResponseDto {
  @IsString()
  @IsOptional()
  public message?: string;

  @IsString()
  @IsOptional()
  public score?: number;

  @IsOptional()
  public question?: QuestionDto;
}
