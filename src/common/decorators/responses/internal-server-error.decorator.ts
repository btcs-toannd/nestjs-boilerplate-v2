import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/decorators/responses/error.decorator';

import FailResponseDto from 'src/common/dtos/fail-response.dto';
import { MessageType } from 'src/common/models/AppResponse';

export const InternalServerErrorResponse = (error = null, cautions = null) =>
  applyDecorators(
    ApiExtraModels(FailResponseDto),
    ErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MessageType.INTERNAL_SERVER_ERROR,
      errorMessage: error?.message ?? 'ERROR_DESCRIPTION',
      errorCode: error?.errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error response',
      cautions,
    }),
  );
