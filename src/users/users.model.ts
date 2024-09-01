import {
  prop,
  getModelForClass,
  modelOptions,
  index,
  mongoose,
  Ref,
} from '@typegoose/typegoose';
import { Question } from 'src/questions/questions.model';
import { Test } from 'src/tests/tests.model';

class TestResult {
  @prop({ ref: () => Test })
  public testId!: Ref<Test>;

  @prop()
  public score!: number;

  @prop({ default: false })
  public completed!: boolean;

  @prop({
    type: () => [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        answer: String,
        correct: Boolean,
      },
    ],
    _id: false,
  })
  public responses!: {
    questionId: Ref<Question>;
    answer: string;
    correct: boolean;
  }[];

  @prop({ default: Date.now })
  public dateTaken!: Date;
}

@index({ email: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ auto: true })
  public _id: mongoose.Schema.Types.ObjectId;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  public password!: string;

  @prop({ ref: 'Role' })
  public role?: string;

  @prop({ ref: 'Status' })
  public status?: string;

  @prop({ type: () => [TestResult], _id: false })
  public testsTaken?: TestResult[];
}
export const UserModel = getModelForClass(User);
