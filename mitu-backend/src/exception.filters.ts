import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionOutputDto } from './dto/exception.output';
import { Prisma } from '@prisma/client';
import { isArray } from 'class-validator';
import { ERROR_INTERNAL_SERVER_ERROR } from './strings';

/**
 * Formats the errors to an array.
 * @param errors The errors to be formatted.
 * @returns The formatted errors.
 */
function formatErrors(errors: any) {
  if (isArray(errors)) return errors;
  else return [errors];
}

const logger = new Logger('ExceptionFilter');

/**
 * Filter for Prisma exceptions.
 * Catches Prisma.PrismaClientValidationError and formats it to JSON.
 * @implements {ExceptionFilter}
 * @class
 * @exports
 */
@Catch(Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  /**
   * Catches Prisma.PrismaClientValidationError and formats it to JSON.
   * @param {Prisma.PrismaClientValidationError} exception The exception to be caught.
   * @param {ArgumentsHost} host The host of the exception.
   * @returns {void}
   */
  catch(
    exception: Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const json = {
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      data: formatErrors(exception.message.split('\n').filter((e) => e)),
      timestamp: new Date().toISOString(),
    };

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(json);
    logger.error(formatErrorMessage(json, request));
  }
}

/**
 * Filter for Http exceptions.
 * Catches HttpException and formats it to JSON.
 * @implements {ExceptionFilter}
 * @class
 * @exports
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const data = exception.getResponse() as ExceptionOutputDto;
    console.error(exception);
    const json = {
      statusCode: status,
      data: formatErrors(data),
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status).json(json);
    logger.error(formatErrorMessage(json, request));
  }
}

/**
 * Filter for general exceptions.
 * Catches Error and formats it to JSON.
 * @implements {ExceptionFilter}
 * @class
 * @exports
 */
@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    console.error(exception);
    const e = new ExceptionOutputDto([ERROR_INTERNAL_SERVER_ERROR]);
    const json = {
      statusCode: 500,
      data: formatErrors(e),
      timestamp: new Date().toISOString(),
    };
    response.status(500).json(json);
    logger.error(formatErrorMessage(json, request));
  }
}

/**
 * Formats the error message.
 * @param resBody The response body.
 * @param req The request.
 * @returns The formatted error message.
 */
function formatErrorMessage(resBody: object, req: Request) {
  const queryString = JSON.stringify(req.query, null, 2);
  const path = req.path;
  return `\nReceived ${req.method} on ${path} \n body: ${JSON.stringify(req.body, null, 2)} \n query: ${queryString}\nResponded with body:\n ${JSON.stringify(resBody, null, 2)}`;
}
