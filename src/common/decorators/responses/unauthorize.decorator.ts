import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/decorators/responses/error.decorator';

import FailResponseDto from 'src/common/dtos/fail-response.dto';
import { MessageType } from 'src/common/models/AppResponse';

export const UnauthorizedErrorResponse = (error = null, cautions = null) =>
  applyDecorators(
    ApiExtraModels(FailResponseDto),
    ErrorResponse({
      status: HttpStatus.UNAUTHORIZED,
      message: MessageType.UNAUTHORIZED,
      errorMessage: error?.message ?? 'ERROR_DESCRIPTION',
      errorCode: error?.errorCode ?? HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized error response',
      cautions,
    }),
  );
