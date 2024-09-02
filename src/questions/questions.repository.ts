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

  async createMany(
    questionsToInsert: CreateQuestionDto[],
  ): Promise<Question[]> {
    return this.questionModel
      .insertMany(questionsToInsert)
      .then((result) => result.map((doc) => doc.toObject()));
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findById(id: string): Promise<Question | null> {
    const objectId = new ObjectId(id);
    return this.questionModel.findById(objectId).exec();
  }

  findByDifficulty(difficulty: number): Question[] | PromiseLike<Question[]> {
    return this.questionModel.find({ difficulty }).exec();
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
