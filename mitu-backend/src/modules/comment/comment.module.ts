import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { FilehandlerModule } from '../filehandler/filehandler.module';
import { PostModule } from '../post/post.module';
import { CommentController } from './comment.controller';

/**
 * Comment module
 * @description
 * Module for comment operations
 */
@Module({
  imports: [FilehandlerModule, forwardRef(() => PostModule)],
  providers: [CommentService, CommentRepository],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
