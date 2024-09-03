import { Question } from '../questions/questions.model';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export class TestResponse {
  @Prop({
    ref: Question.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public questionId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  public answer!: string;

  @Prop({ required: true })
  public correct!: boolean;
}

@Schema({
  timestamps: true,
})
export class TestResult {
  @Prop({ auto: true })
  public _id!: mongoose.Types.ObjectId;

  @Prop({
    ref: 'Test',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public testId!: mongoose.Types.ObjectId;

  @Prop({
    ref: 'User',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public userId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  public score!: number;

  @Prop({ required: true, default: false })
  public completed!: boolean;

  @Prop({ type: () => [TestResponse], _id: false })
  public responses!: TestResponse[];

  @Prop({ default: Date.now })
  public dateTaken!: Date;
}

export const TestResultModelSchema = SchemaFactory.createForClass(TestResult);
