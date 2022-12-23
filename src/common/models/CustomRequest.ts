/* eslint-disable import/no-extraneous-dependencies */
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: Record<string, unknown>;
  scope?: string[];
  companyCode: string;
}
