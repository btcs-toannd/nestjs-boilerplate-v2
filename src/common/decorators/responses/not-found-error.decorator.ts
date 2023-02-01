import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/decorators/responses/error.decorator';

import FailResponseDto from 'src/common/dtos/fail-response.dto';
import { MessageType } from 'src/common/models/AppResponse';

export const NotFoundErrorResponse = (error = null, cautions = null) =>
  applyDecorators(
    ApiExtraModels(FailResponseDto),
    ErrorResponse({
      status: HttpStatus.NOT_FOUND,
      message: MessageType.NOT_FOUND,
      errorMessage: error?.message ?? 'ERROR_DESCRIPTION',
      errorCode: error?.errorCode ?? HttpStatus.NOT_FOUND,
      description: 'Not found error response',
      cautions,
    }),
  );
