import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';

import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';
import testAlgorithmConfig from './tests/config/testAlgorithm.config';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import authConfig from './auth/config/auth.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database/mongoose-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, testAlgorithmConfig, authConfig],
      envFilePath: ['.env'],
    }),
    // TypegooseModule.forRootAsync({
    //   useClass: TypegooseConfigService,
    // }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
    TestsModule,
    AuthModule,
    QuestionsModule,
  ],
})
export class AppModule {}
