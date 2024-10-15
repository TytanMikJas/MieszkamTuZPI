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
import { Prisma } from '@prisma/client/';
import { isArray } from 'class-validator';
import { ERROR_INTERNAL_SERVER_ERROR } from './strings';

function formatErrors(errors: any) {
  if (isArray(errors)) return errors;
  else return [errors];
}

const logger = new Logger('ExceptionFilter');

@Catch(Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
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

function formatErrorMessage(resBody: object, req: Request) {
  const queryString = JSON.stringify(req.query, null, 2);
  const path = req.path;
  return `\nReceived ${req.method} on ${path} \n body: ${JSON.stringify(req.body, null, 2)} \n query: ${queryString}\nResponded with body:\n ${JSON.stringify(resBody, null, 2)}`;
}
