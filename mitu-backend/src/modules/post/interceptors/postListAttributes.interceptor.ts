import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { PostService } from '../post.service';
import UserInternalDto from 'src/modules/user/dto/user.internal';

@Injectable()
export class PostListAttributesInterceptor implements NestInterceptor {
  constructor(private postService: PostService) {} // Inject your service

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user: UserInternalDto = context.switchToHttp().getRequest().user;
    return next.handle().pipe(
      switchMap(async (data: any) => {
        //getting ids array
        const ids = data?.map((d) => d.id);

        //taking advantage of dictionary O(1) access time
        const dataDict = data?.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {});

        // getting attributes from given post ids
        const attributes = await this.postService.getAttributes(ids, user);

        // merging attributes with the original data
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
