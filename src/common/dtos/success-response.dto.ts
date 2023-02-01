import { OmitType } from '@nestjs/swagger';

import AppResponse from 'src/common/models/AppResponse';

export default class SuccessResponseDto extends OmitType(AppResponse, [
  'error',
] as const) {}
