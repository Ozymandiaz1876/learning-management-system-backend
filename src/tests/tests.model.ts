import { prop, getModelForClass, Ref, mongoose } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { v4 } from 'uuid';

class AdaptiveAlgorithm {
  @prop({
    required: true,
  })
  public initialDifficulty!: number;

  @prop({ required: true })
  public correctAdjustment!: number;

  @prop({ required: true })
  public incorrectAdjustment!: number;

  @prop({ required: true })
  public maxQuestions!: number;

  @prop({ required: true })
  public minDifficulty!: number;

  @prop({ required: true })
  public maxDifficulty!: number;

  @prop({ required: true })
  public consecutiveCorrectToEnd!: number;
}

export class Test {
  @prop({
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  })
  public _id?: string;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true, unique: true, default: v4() })
  public uniqueUrlId!: string;

  @prop({ ref: () => User, required: true })
  public createdBy!: Ref<User>;

  @prop({ required: true, _id: false })
  public adaptiveAlgorithm!: AdaptiveAlgorithm;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop()
  public updatedAt?: Date;
}

export const TestModel = getModelForClass(Test);
