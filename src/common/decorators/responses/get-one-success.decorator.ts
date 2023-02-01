import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import SuccessResponseDto from 'src/common/dtos/success-response.dto';
import Collection from 'src/common/models/Collection';

export const GetOneSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto | null,
  cautions?: string[] | null,
) =>
  applyDecorators(
    dataDto
      ? ApiExtraModels(SuccessResponseDto, Collection, dataDto)
      : ApiExtraModels(SuccessResponseDto, Collection),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: dataDto
                ? { $ref: getSchemaPath(dataDto as DataDto) }
                : { type: 'integer', nullable: true, example: null },
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
      description: 'Get record successfully',
    }),
  );
