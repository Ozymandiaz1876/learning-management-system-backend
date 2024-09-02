import { IsString } from 'class-validator';

export class SubmitTestAnswerDto {
  @IsString()
  public testId: string;

  @IsString()
  public questionId: string;

  @IsString()
  public answer: string;

  @IsString()
  public userId: string;
}
