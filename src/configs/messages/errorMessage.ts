import auth from './auth';

export const makeDummyErr = (path: string) => ({
  httpCode: 500,
  code: 1000000,
  message: `path '${path}' not defined yet`,
});

/**
 * Pattern of error codes xxyyzzz
 * xx is the increment number for a feature group.
 * yy is the increment number for an API group like CRUD tenants or CURD users.
 * zzz is increment number
 */
export const errorMessages = {
  common: {
    serverError: {
      httpCode: 500,
      code: 1000001,
      message: 'internal server error',
    },
    invalidToken: {
      httpCode: 401,
      code: 1000002,
      message: 'access token has expired or is not yet valid',
    },
    noPrivilege: {
      httpCode: 403,
      code: 1000003,
      message: 'no privilege',
    },
  },
  validation: {
    validationFailed: {
      httpCode: 400,
      code: 1000003,
      message:
        'This message is representative of all validation error messages that depend on the class-validator library. Because we expect all validation errors to be caught at the front end, we do not specify it in Swagger',
    },
  },
  // 12yyzzz
  auth,
};
