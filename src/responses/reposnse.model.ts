import { prop, getModelForClass, Ref, mongoose } from '@typegoose/typegoose';
import { User } from '../users/users.model';
import { Test } from '../tests/tests.model';
import { Question } from '../questions/questions.model';

class Response {
  @prop({
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  })
  public _id?: string;

  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ ref: () => Test, required: true })
  public testId!: Ref<Test>;

  @prop({ ref: () => Question, required: true })
  public questionId!: Ref<Question>;

  @prop({ required: true })
  public answer!: string;

  @prop({ required: true })
  public correct!: boolean;

  @prop({ default: Date.now })
  public timestamp?: Date;
}

export const ResponseModel = getModelForClass(Response);
