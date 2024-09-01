import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTestDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public uniqueUrlId: string;

  @IsString()
  public createdBy: string;
}
