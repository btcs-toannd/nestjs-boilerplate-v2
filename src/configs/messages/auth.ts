import { HttpStatus } from '@nestjs/common';

export default {
  // 1200xxx
  login: {
    incorrect: {
      httpCode: HttpStatus.UNAUTHORIZED,
      code: 1200000,
      message: 'Username or password incorrect',
    },
    limitLineNotFound: {
      httpCode: HttpStatus.UNAUTHORIZED,
      code: 1200001,
      message: 'Maximum channel was not found',
    },
    licenseExpired: {
      httpCode: HttpStatus.UNAUTHORIZED,
      code: 1200002,
      message: 'Your license has been expired',
    },
    invalidEncryptedLicense: {
      httpCode: HttpStatus.UNAUTHORIZED,
      code: 1200004,
      message: 'Encrypted license incorrect',
    },
  },
  // 1201xxx
  logout: {
    unauthorized: {
      httpCode: HttpStatus.UNAUTHORIZED,
      code: 1201000,
      message: 'Refresh token is invalid',
    },
  },
  // 1202xxx
  refreshTokens: {
    unauthorized: {
      httpCode: HttpStatus.UNAUTHORIZED,
      code: 1202000,
      message: 'Refresh token is invalid',
    },
  },
};
