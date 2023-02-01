import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import FailResponseDto from 'src/common/dtos/fail-response.dto';

export const ErrorResponse = ({
  status,
  message,
  errorMessage,
  errorCode,
  description,
  cautions,
}) =>
  applyDecorators(
    ApiExtraModels(FailResponseDto),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(FailResponseDto) },
          {
            properties: {
              message: {
                type: 'string',
                example: message,
              },
              error: {
                type: 'object',
                properties: {
                  messages: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: errorMessage,
                    },
                  },
                  errorCode: {
                    type: 'number',
                    example: errorCode,
                  },
                },
              },
              cautions: cautions
                ? {
                    type: 'array',
                    example: cautions,
                  }
                : {
                    type: 'string',
                    example: null,
                  },
            },
          },
        ],
      },
      description,
    }),
  );
