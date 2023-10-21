import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(envFile?: string): DynamicModule {
    const providers = [
      {
        provide: ConfigService,
        inject: [],
        useFactory: () => new ConfigService(envFile || '.env'),
      },
    ];

    return {
      imports: [],
      providers,
      exports: providers,
      module: ConfigModule,
    };
  }
}
