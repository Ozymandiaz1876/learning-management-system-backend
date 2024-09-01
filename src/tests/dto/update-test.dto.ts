import { IsString, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateTestDto {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsArray()
  @IsOptional()
  public questions?: Types.ObjectId[];

  @IsOptional()
  public results?: any[];
}
