import { IsString } from 'class-validator';

export class StartTestDto {
  @IsString()
  public userId: string;
  @IsString()
  public testId: string;
}
