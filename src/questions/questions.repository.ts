import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './questions.model';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionModel.create(createQuestionDto);
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findById(id: string): Promise<Question | null> {
    const objectId = new ObjectId(id);
    return this.questionModel.findById(objectId).exec();
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question | null> {
    const objectId = new ObjectId(id);
    return this.questionModel
      .findByIdAndUpdate(objectId, updateQuestionDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async delete(id: string): Promise<Question | null> {
    const objectId = new ObjectId(id);
    return this.questionModel.findByIdAndDelete(objectId).exec();
  }
}
