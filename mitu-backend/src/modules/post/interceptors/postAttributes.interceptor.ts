import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { PostService } from '../post.service';

@Injectable()
export class PostAttributesInterceptor implements NestInterceptor {
  constructor(private postService: PostService) {} // Inject your service

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      switchMap(async (data) => {
        const attributes = await this.postService.getAttributes([data.id]); // Get custom data from your service
        return {
          ...data,
          ...attributes[0], // Add custom data from your service to the response
        };
      }),
    );
  }
}
