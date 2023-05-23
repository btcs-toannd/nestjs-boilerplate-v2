import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ReadonlyDatabaseVariables } from './entities/database-variables.entity';

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(ReadonlyDatabaseVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
