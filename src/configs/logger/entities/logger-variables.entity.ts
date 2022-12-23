import { IsEnum } from 'class-validator';

import { LOGGER_LEVEL } from '../../../common/constants/configs';

export class LoggerVariables {
  @IsEnum(LOGGER_LEVEL)
  LOGGER_LEVEL: string;
}
