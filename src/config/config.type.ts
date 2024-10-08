import { AuthConfig } from 'src/auth/config/auth-config.type';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { TestAlgorithmConfig } from 'src/tests/config/testAlgorithm-config.type';

export type AllConfigType = {
  database: DatabaseConfig;
  testAlgorithm: TestAlgorithmConfig;
  auth: AuthConfig;
};
