import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import SuccessResponseDto from 'src/common/dtos/success-response.dto';
import Collection from 'src/common/models/Collection';

export const DeletedSuccessResponse = (cautions?: string[] | null) =>
  applyDecorators(
    ApiExtraModels(SuccessResponseDto, Collection),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
          {
            properties: {
              data: {
                type: 'integer',
                nullable: true,
                example: null,
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
      description: 'Deleted successfully',
    }),
  );
