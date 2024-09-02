import { IsString, IsOptional } from 'class-validator';

export class UpdateTestDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public description?: string;
}
