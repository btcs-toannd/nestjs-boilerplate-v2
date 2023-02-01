import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/decorators/responses/error.decorator';

import FailResponseDto from 'src/common/dtos/fail-response.dto';
import { MessageType } from 'src/common/models/AppResponse';

export const ApiException = ({
  status,
  message = MessageType.BAD_REQUEST,
  errorMessage,
  errorCode,
  description,
  cautions = null,
}) =>
  applyDecorators(
    ApiExtraModels(FailResponseDto),
    ErrorResponse({
      status,
      message,
      errorMessage,
      errorCode,
      description,
      cautions,
    }),
  );
