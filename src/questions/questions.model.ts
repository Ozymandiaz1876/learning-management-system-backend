import { prop, getModelForClass, Ref, mongoose } from '@typegoose/typegoose';
import { User } from '../users/users.model';

class Option {
  @prop({ required: true })
  public text!: string;

  @prop({ required: true })
  public isCorrect!: boolean;
}

export class Question {
  @prop({
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  })
  public _id?: string;

  @prop({ required: true })
  public questionText!: string;

  @prop({ type: () => [Option], required: true, _id: false })
  public options!: Option[];

  @prop({ required: true })
  public difficulty!: number;

  @prop({ ref: () => User, required: true })
  public createdBy!: Ref<User>;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop()
  public updatedAt?: Date;
}

export const QuestionModel = getModelForClass(Question);
