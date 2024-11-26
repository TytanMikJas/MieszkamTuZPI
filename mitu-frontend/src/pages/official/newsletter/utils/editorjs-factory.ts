import EditorJS, { OutputData } from '@editorjs/editorjs';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';

import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';

interface createMailEditorProps {
  onChange: () => void;
  initialData?: OutputData;
}

export function createMailEditor({
  onChange,
  initialData,
}: createMailEditorProps) {
  return new EditorJS({
    holder: 'mail-editor',
    autofocus: true,
    onChange: onChange,
    data: initialData ? initialData : undefined,
    tools: {
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: '/api/filehandler/newsletter-image',
          },
          field: 'image',
        },
      },
      header: {
        class: Header,
        inlineToolbar: true,
        config: {
          placeholder: 'Wstaw nagłówek',
          levels: [1, 2, 3],
          defaultLevel: 1,
        },
      },
      delimiter: {
        class: Delimiter,
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
    },
  });
}
