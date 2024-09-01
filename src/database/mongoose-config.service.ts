import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { QuestionModel } from 'src/questions/questions.model';
import { ResponseModel } from 'src/responses/reposnse.model';
import { TestModel } from 'src/tests/tests.model';
import { UserModel } from 'src/users/users.model';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get('database.url', { infer: true }),
      dbName: this.configService.get('database.name', { infer: true }),
      user: this.configService.get('database.username', { infer: true }),
      pass: this.configService.get('database.password', { infer: true }),
      connectionFactory: (connection) => {
        connection.model('User', UserModel);
        connection.model('Question', QuestionModel);
        connection.model('Test', TestModel);
        connection.model('responses', ResponseModel);
        return connection;
      },
    };
  }
}
