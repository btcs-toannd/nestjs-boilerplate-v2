import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { errorMessages, makeDummyErr } from 'configs/messages/errorMessage';
import * as lodash from 'lodash';

import AppError from './AppError';

export enum MessageType {
  // 200 201
  SUCCESS = 'SUCCESS',
  RESTORE_FINISHED = 'RESTORE_FINISHED',
  // 400
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  BAD_REQUEST = 'BAD_REQUEST',
  // 401
  UNAUTHORIZED = 'AUTHENTICATION_FAILED',
  // 403
  FORBIDDEN = 'FORBIDDEN',
  // 404
  NOT_FOUND = 'NOT_FOUND',
  // 409
  CONFLICT = 'CONFLICT',
  // 422
  UNPROCESSABLE_CONTENT = 'UNPROCESSABLE_CONTENT',
  // 430
  RESTORE_SHELL_ERROR = 'RESTORE_SHELL_ERROR',
  // 431
  SYNC_SHELL_ERROR = 'SYNC_SHELL_ERROR',
  // 500
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const mapHttpCodeToMessage = {
  // 200 201
  200: 'SUCCESS',
  201: 'SUCCESS',
  // 207: 'RESTORE_FINISHED',
  // 400
  400: 'BAD_REQUEST',
  // 401
  401: 'AUTHENTICATION_FAILED',
  // 403
  403: 'FORBIDDEN',
  // 404
  404: 'NOT_FOUND',
  // 409
  409: 'CONFLICT',
  // 422
  422: 'UNPROCESSABLE_CONTENT',
  // 430
  430: 'RESTORE_SHELL_ERROR',
  // 431
  431: 'SYNC_SHELL_ERROR',
  // 500
  500: 'INTERNAL_SERVER_ERROR',
};

export default class AppResponse<T> {
  @ApiProperty({
    description: 'API response result',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'API response message',
    example: MessageType.SUCCESS,
  })
  message: MessageType;

  @ApiProperty({
    description: 'API response error',
  })
  error?: AppError;

  @ApiProperty({
    description: 'API response data',
  })
  data?: T;

  @ApiProperty({
    description:
      'Push messages into cautions if we want to send more information to the client',
    required: false,
  })
  cautions?: string[];

  constructor(
    success: boolean,
    message: MessageType,
    error?: AppError,
    data?: T,
    cautions?: string[],
  ) {
    this.success = success;
    this.message = message;
    this.error = error;
    this.data = data;
    this.cautions = cautions;
  }

  static success<T = any>(data?: T, cautions?: string[]): AppResponse<T> {
    const realCautions = cautions && cautions.length > 0 ? cautions : undefined;

    return new AppResponse(
      true,
      MessageType.RESTORE_FINISHED,
      undefined,
      data,
      realCautions,
    );
  }

  static ok<T = any>(data?: T, cautions?: string[]): AppResponse<T> {
    const realCautions = cautions && cautions.length > 0 ? cautions : undefined;

    return new AppResponse(
      true,
      MessageType.SUCCESS,
      undefined,
      data,
      realCautions,
    );
  }

  static error(
    path: string,
    extra?: {
      cautions?: string[];
      msgParams?: Record<string, string | number | boolean>;
    },
  ): HttpException {
    const errorConfig = lodash.get(errorMessages, path, makeDummyErr(path));
    const { httpCode, code, message } = errorConfig;
    const error: AppError = { code, message };

    // replace {{param}} in error message with value
    if (extra?.msgParams) {
      const matchArr = error.message.match(/{{(.*?)}}/g) || [];
      // remove "{{" and "}}" in matchArr
      const params = matchArr.map((key) => key.slice(2, key.length - 2));

      params.forEach((param) => {
        if (extra.msgParams[param] !== undefined) {
          error.message = error.message.replace(
            `{{${param}}}`,
            String(extra.msgParams[param]),
          );
        }
      });
    }

    return new HttpException(
      new AppResponse(
        false,
        mapHttpCodeToMessage[httpCode] || mapHttpCodeToMessage[500],
        error,
        undefined,
        extra?.cautions,
      ),
      httpCode,
    );
  }

  static badRequest(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.BAD_REQUEST,
        {
          message: errorMessage.join('. '),
          code: errorCode || HttpStatus.BAD_REQUEST,
        },
        undefined,
        cautions,
      ),
      HttpStatus.BAD_REQUEST,
    );
  }

  static validationFailed(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.VALIDATION_FAILED,
        {
          message: errorMessage[0],
          code: errorCode,
        },
        undefined,
        cautions,
      ),
      HttpStatus.BAD_REQUEST,
    );
  }

  static validationFailedFromValidatorErrors(
    errors: ValidationError[],
  ): HttpException {
    const validateErrorTemplate = errorMessages.validation.validationFailed;
    const firstError = errors[0];
    const errorMessage = Object.values(firstError.constraints)[0];

    return new HttpException(
      new AppResponse(false, MessageType.VALIDATION_FAILED, {
        message: errorMessage,
        code: validateErrorTemplate.code,
      }),
      validateErrorTemplate.httpCode,
    );
  }

  static authenticationFailed(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.UNAUTHORIZED,
        {
          message: errorMessage[0],
          code: errorCode,
        },
        undefined,
        cautions,
      ),
      HttpStatus.UNAUTHORIZED,
    );
  }

  static forbidden(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.FORBIDDEN,
        {
          message: errorMessage[0],
          code: errorCode || HttpStatus.FORBIDDEN,
        },
        undefined,
        cautions,
      ),
      HttpStatus.FORBIDDEN,
    );
  }

  static unauthorized(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.UNAUTHORIZED,
        {
          message: errorMessage.join('. '),
          code: errorCode || HttpStatus.UNAUTHORIZED,
        },
        undefined,
        cautions,
      ),
      HttpStatus.UNAUTHORIZED,
    );
  }

  static notFound(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.NOT_FOUND,
        {
          message: errorMessage.join('. '),
          code: errorCode || HttpStatus.NOT_FOUND,
        },
        undefined,
        cautions,
      ),
      HttpStatus.NOT_FOUND,
    );
  }

  static conflict(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.CONFLICT,
        {
          message: errorMessage.join('. '),
          code: errorCode || HttpStatus.CONFLICT,
        },
        undefined,
        cautions,
      ),
      HttpStatus.CONFLICT,
    );
  }

  static internalServerError(
    errorMessage: string[],
    errorCode?: number,
    cautions?: string[],
  ): HttpException {
    return new HttpException(
      new AppResponse(
        false,
        MessageType.INTERNAL_SERVER_ERROR,
        {
          message: errorMessage.join('. '),
          code: errorCode || HttpStatus.INTERNAL_SERVER_ERROR,
        },
        undefined,
        cautions,
      ),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
