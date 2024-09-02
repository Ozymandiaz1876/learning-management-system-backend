import { IsString } from 'class-validator';

export class CreateTestDto {
  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public createdBy: string;
}
