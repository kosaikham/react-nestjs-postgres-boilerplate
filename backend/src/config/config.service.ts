import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type EnvConfig = Record<string, string>;

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;
  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'test', 'uat', 'production')
        .default('development'),
      PORT: Joi.number().default(8080),
      JWT_SECRET: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        allowUnknown: true,
      },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  get(key: string, defaultValue?: string): string {
    return process.env[key] || this.envConfig[key] || defaultValue;
  }

  getN(key: string, defaultValue?: number): number {
    return parseInt(this.get(key), 10) || defaultValue;
  }

  async getTypeOrmConfig(entities?: any): Promise<TypeOrmModuleOptions> {
    const dbPw = { value: this.get('DB_PASSWORD') };
    return {
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: parseInt(this.get('DB_PORT', '5432'), 10),
      username: this.get('DB_USERNAME'),
      password: dbPw.value,
      database: this.get('DB_DATABASE'),
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      logging: false,
      dropSchema: false,
      ssl: false,
      synchronize: true,
      uuidExtension: 'pgcrypto',
    };
  }
}
