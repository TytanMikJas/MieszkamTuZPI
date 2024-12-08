import { useRef, useState } from 'react';
import { Input } from '../../../shadcn/input';
import { PostComment } from '../../../types';
import AttachIcon from '../../icons/attach-icon/AttachIcon';
import SendIcon from '../../icons/send-icon/SendIcon';
import CrossIcon from '../../icons/cross-icon/CrossIcon';
import Truncate from '@/reusable-components/misc/truncate/Truncate';
import {
  IMAGE_EXT_LIST,
  IMAGE_MIME_TYPES,
  REPLY_TO_CONTENT_TRUNCATE_LENGTH,
} from '../../../constants';
import { Label } from '@/shadcn/label';
import { attachmentNameTruncateLogic, validateFile } from '@/utils';
import { emitError } from '@/toast-actions';
import { FILE_IMAGE_NAME } from '@/strings';
import { Badge } from '@/shadcn/badge';
import { X } from 'lucide-react';
import PulseLoader from '@/reusable-components/loaders/PulseLoader';
import {
  MAX_LENGTH_COMMENT_CONTENT,
  MIN_LENGTH_COMMENT_CONTENT,
} from '@/max-lengths';
import ExpectLoggedIn from '@/reusable-components/login-dialog/ExpectLoggedIn';

export default function CommentInput({
  rootId,
  postComment,
  postCommentLoading,
  replyToContent,
  clearReply,
}: {
  rootId: string;
  postComment: PostComment;
  postCommentLoading: boolean;
  replyToContent?: string;
  clearReply?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handlePostComment = () => {
    if (inputRef.current) {
      const val = inputRef.current.value;

      if (!val) {
        emitError('Komentarz musi mieć treść');
        return;
      }

      if (val.trim().length > MAX_LENGTH_COMMENT_CONTENT) {
        emitError(
          `Maksymalna długość komentarza to ${MAX_LENGTH_COMMENT_CONTENT} znaków`,
        );
        return;
      }

      if (val.trim().length < MIN_LENGTH_COMMENT_CONTENT) {
        emitError(
          `Minimalna długość komentarza to ${MIN_LENGTH_COMMENT_CONTENT} znaków`,
        );
        return;
      }

      if (selectedImage) {
        postComment(rootId, inputRef.current.value, [selectedImage]);
        handleRemoveFile();
      } else {
        postComment(rootId, inputRef.current.value);
      }

      inputRef.current.value = '';
    }
  };

  const handleClearReply = () => {
    if (clearReply) {
      clearReply();
      if (inputRef.current?.value) {
        inputRef.current.value = '';
      }
    }
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const validateCommImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;

    const [error, fileType] = validateFile(image, [FILE_IMAGE_NAME]);

    if (error) {
      emitError(error);
      return;
    }

    setSelectedImage(image);
  };

  const handleRemoveFile = () => {
    setSelectedImage(null);
    if (imageUploadRef.current && imageUploadRef.current.files) {
      imageUploadRef.current.value = '';
    }
  };

  const imageUploadRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex relative flex-col gap-2 pb-2">
      <div className="absolute flex flex-col gap-2 top-full">
        {selectedImage && (
          <div className="absolut w-full -bottom-7 z-[51]">
            <Badge variant="default">
              <Truncate
                text={selectedImage.name}
                length={20}
                truncateLogic={attachmentNameTruncateLogic}
              />
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={handleRemoveFile}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          </div>
        )}
        {replyToContent && (
          <div className="absolut w-full -bottom-[5.5rem] bg-gray-100 justify-center flex flex-col  flex-wrap py-2 px-4 bg-opacity-1 rounded-lg overflow-hidden shadow">
            <div className="flex items-center gap-2 justify-between">
              <p className="text-xs">Odpowiadasz na:</p>
              <CrossIcon size={20} onClick={handleClearReply} />
            </div>
            <Truncate
              text={replyToContent}
              length={REPLY_TO_CONTENT_TRUNCATE_LENGTH}
              tooltip={false}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          maxLength={MAX_LENGTH_COMMENT_CONTENT}
          className="outline outline-primary outline-2"
          placeholder="Napisz komentarz..."
        />
        <div className="flex flex-row gap-2 items-center">
          <div className="flex items-center">
            <Label htmlFor="picture">
              <AttachIcon />
            </Label>
            <Input
              ref={imageUploadRef}
              onChange={(e) => validateCommImage(e)}
              className="hidden"
              id="picture"
              accept={`${[...IMAGE_MIME_TYPES, ...IMAGE_EXT_LIST].join(', ')}`}
              type="file"
            />
          </div>
          {postCommentLoading ? (
            <PulseLoader size={20} />
          ) : (
            <ExpectLoggedIn>
              <SendIcon onClick={handlePostComment} />
            </ExpectLoggedIn>
          )}
        </div>
      </div>
    </div>
  );
}
