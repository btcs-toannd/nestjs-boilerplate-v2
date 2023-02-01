import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import * as lodash from 'lodash';

import { errorMessages, makeDummyErr } from 'configs/messages/errorMessage';
import FailResponseDto from 'src/common/dtos/fail-response.dto';
import AppError from 'src/common/models/AppError';
import { mapHttpCodeToMessage } from 'src/common/models/AppResponse';

export const ErrorResponse = (
  path: string,
  options?: { hasValidationErr: boolean },
) => {
  const errorConfig = lodash.get(errorMessages, path, makeDummyErr(path));

  if (options?.hasValidationErr) {
    const { validationFailed } = errorMessages.validation;
    (errorConfig as any).validationFailed = validationFailed;
  }

  const errorGroups: Record<number, AppError[]> = {};

  Object.values(errorConfig).forEach((curValue: any) => {
    const { httpCode, code, message } = curValue;
    const error: AppError = { code, message };

    if (!errorGroups[httpCode]) {
      errorGroups[httpCode] = [];
    }

    errorGroups[curValue.httpCode].push(error);
  });

  const errorDecorators = Object.entries(errorGroups).map(
    ([httpCode, errors]) => {
      const message =
        mapHttpCodeToMessage[httpCode] || mapHttpCodeToMessage[500];

      const errorSchemas = errors.map((error) => ({
        properties: {
          message: {
            type: 'string',
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              code: {
                type: 'number',
              },
            },
            required: ['message', 'code'],
          },
          cautions: {
            type: 'array',
            description:
              'Push messages into cautions if we want to send more information to the client',
            items: {
              type: 'string',
            },
          },
        },
        example: {
          error: { code: error.code, message: error.message },
          message,
        },
        required: ['message', 'error'],
      }));

      return ApiResponse({
        status: Number(httpCode),
        schema: {
          oneOf: errorSchemas,
        },
      });
    },
  );

  return applyDecorators(ApiExtraModels(FailResponseDto), ...errorDecorators);
};
