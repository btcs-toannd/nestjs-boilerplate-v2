import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ErrorResponse } from 'src/common/decorators/responses/error.decorator';
import FailResponseDto from 'src/common/dtos/fail-response.dto';
import { MessageType } from 'src/common/models/AppResponse';

export const BadRequestErrorResponse = (error = null, cautions = null) =>
  applyDecorators(
    ApiExtraModels(FailResponseDto),
    ErrorResponse({
      status: HttpStatus.BAD_REQUEST,
      message: MessageType.BAD_REQUEST,
      errorMessage: error?.message ?? 'ERROR_DESCRIPTION',
      errorCode: error?.errorCode ?? HttpStatus.BAD_REQUEST,
      description: 'Bad request error response',
      cautions,
    }),
  );
