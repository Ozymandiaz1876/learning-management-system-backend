import mongoose from 'mongoose';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';

class Option {
  @Prop({ required: true })
  public text!: string;

  @Prop({ required: true })
  public isCorrect!: boolean;
}

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({ auto: true })
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  public questionText!: string;

  @Prop({ type: () => [Option], required: true, _id: false })
  public options!: Option[];

  @Prop({ required: true })
  public difficulty!: number;

  @Prop({
    ref: 'User',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public createdBy!: mongoose.Types.ObjectId;
}

export const QuestionModelSchema = SchemaFactory.createForClass(Question);
