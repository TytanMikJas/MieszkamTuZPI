import { RequestLoggingInterceptor } from './request-logging.interceptor';

describe('LoggingInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestLoggingInterceptor()).toBeDefined();
  });
});
