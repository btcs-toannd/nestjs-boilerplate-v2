import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

import { ENVIRONMENTS } from '../../../common/constants/configs';

export class AppVariables {
  @IsEnum(ENVIRONMENTS)
  APP_ENV: string;

  @IsString()
  APP_NAME: string;

  @IsUrl()
  APP_URL: string;

  @IsNumber()
  @IsOptional()
  APP_PORT: number;
}
