import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import SuccessResponseDto from 'src/common/dtos/success-response.dto';
import Collection from 'src/common/models/Collection';

export const GetListSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  cautions?: string[] | null,
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseDto, Collection, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
              cautions: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: cautions || [],
                },
                example: cautions || null,
              },
            },
          },
        ],
      },
      description: 'Get list records successfully',
    }),
  );
