import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { PostService } from '../post.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';

/**
 * Post attributes interceptor
 * @export
 * @class PostAttributesInterceptor
 * @implements {NestInterceptor}
 * @param {PostService} postService
 * @constructor
 */
@Injectable()
export class PostAttributesInterceptor implements NestInterceptor {
  constructor(private postService: PostService) {}

  /**
   * Intercepts the response and attaches attributes to the post
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @returns {Observable<any>}
   * @memberof PostAttributesInterceptor
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user: UserInternalDto = context.switchToHttp().getRequest().user;
    return next.handle().pipe(
      switchMap(async (data) => {
        const attributes = await this.postService.getAttributes(
          [data.id],
          user,
        ); // Get custom data from your service
        return {
          ...data,
          ...attributes[0],
        };
      }),
    );
  }
}
