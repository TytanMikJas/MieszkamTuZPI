import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { PostService } from '../post.service';

/**
 * Post list attributes interceptor
 * @export
 * @class PostListAttributesInterceptor
 * @implements {NestInterceptor}
 * @param {PostService} postService
 * @constructor
 */
@Injectable()
export class PostListAttributesInterceptor implements NestInterceptor {
  constructor(private postService: PostService) {}

  /**
   * Intercepts the response and attaches attributes to the post list
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   * @memberof PostListAttributesInterceptor
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(async (data: any) => {
        const ids = data?.map((d) => d.id);

        const dataDict = data?.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {});

        const attributes = await this.postService.getAttributes(ids);

        const result = attributes.map((a) => {
          const d = dataDict[a.id];
          return {
            ...d,
            ...a,
          };
        });

        return result;
      }),
    );
  }
}
