import { IsString } from 'class-validator';

export class ReadonlyDatabaseVariables {
  @IsString()
  READONLY_DATABASE_URL: string;
}
