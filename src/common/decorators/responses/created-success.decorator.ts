import { applyDecorators, Type } from '@nestjs/common';
import { GetOneSuccessResponse } from 'src/common/decorators/responses/get-one-success.decorator';

export const CreatedSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto | null,
  cautions?: string[] | null,
) => applyDecorators(GetOneSuccessResponse(dataDto, cautions));
