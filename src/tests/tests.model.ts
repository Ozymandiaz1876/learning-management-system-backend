import { v4 } from 'uuid';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

class AdaptiveAlgorithm {
  @Prop({
    required: true,
  })
  public initialDifficulty!: number;

  @Prop({ required: true })
  public correctAdjustment!: number;

  @Prop({ required: true })
  public incorrectAdjustment!: number;

  @Prop({ required: true })
  public maxQuestions!: number;

  @Prop({ required: true })
  public minDifficulty!: number;

  @Prop({ required: true })
  public maxDifficulty!: number;

  @Prop({ required: true })
  public consecutiveCorrectToEnd!: number;
}

@Schema({
  timestamps: true,
})
export class Test {
  @Prop({
    auto: true,
  })
  public _id!: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  public title!: string;

  @Prop({ required: true })
  public description!: string;

  @Prop({
    required: true,
    default: v4(),
  })
  public uniqueUrlId!: string;

  @Prop({
    ref: 'User',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public createdBy!: mongoose.Types.ObjectId;

  @Prop({ required: true, _id: false })
  public adaptiveAlgorithm!: AdaptiveAlgorithm;

  @Prop({ default: Date.now })
  public createdAt?: Date;

  @Prop({ default: Date.now })
  public updatedAt?: Date;
}

export const TestModelSchema = SchemaFactory.createForClass(Test);
