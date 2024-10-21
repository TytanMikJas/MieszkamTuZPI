import { Module } from '@nestjs/common';
import PostRepository from 'src/modules/post/post.repository';
import { PostService } from 'src/modules/post/post.service';
import { FilehandlerModule } from 'src/modules/filehandler/filehandler.module';

@Module({
  imports: [FilehandlerModule],
  providers: [PostService, PostRepository],
  exports: [PostService, PostRepository],
})
export class PostModule {}
