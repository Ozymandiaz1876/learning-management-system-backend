import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TypegooseModuleOptions,
  TypegooseOptionsFactory,
} from '@m8a/nestjs-typegoose';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class TypegooseConfigService implements TypegooseOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypegooseOptions(): TypegooseModuleOptions {
    return {
      uri: this.configService.get('database.url', { infer: true }) || '',
    };
  }
}
