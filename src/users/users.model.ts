import { TestResult } from 'src/results/results.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ auto: true })
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  public email!: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  public password!: string;

  @Prop()
  public role?: string;

  @Prop()
  public status?: string;

  @Prop({ ref: TestResult.name, type: [mongoose.Schema.Types.ObjectId] })
  public testResults?: mongoose.Types.ObjectId[];
}
export const UserModelSchema = SchemaFactory.createForClass(User);
