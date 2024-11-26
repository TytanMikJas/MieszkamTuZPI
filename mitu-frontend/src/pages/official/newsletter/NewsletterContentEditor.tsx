import EditorJS, { OutputData } from '@editorjs/editorjs';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import './newsletter-content-editor.css';
import { Button } from '@/shadcn/button';
import { set } from 'date-fns';
import edjsHTML from 'editorjs-html';
import { parseHeader, parseParagraph } from './parsers/parsers';
import { createMailEditor } from './utils/editorjs-factory';
import { mailHtmlParser } from './utils/edjs-html-parser';
import HTMLMaiilPreview from './HTMLMaiilPreview';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export type NewsletterContentEditorRef = {
  html: () => string;
  edjs: () => OutputData;
};

export type MailEditorProps = { edjsDocument?: OutputData };

export const NewsletterContentEditor = forwardRef(
  (props: MailEditorProps, ref) => {
    console.log('props', props);
    const [currentEDJSDocument, setCurrentEDJSDocument] = useState(
      props.edjsDocument,
    );
    useImperativeHandle(
      ref,
      () => ({
        html: () => currentEDJSDocument && mailHtmlParser(currentEDJSDocument),
        edjs: () => currentEDJSDocument,
      }),
      [currentEDJSDocument],
    );

    useEffect(() => {
      const editor = createMailEditor({
        onChange: async () => {
          const data = await editor.save();
          setCurrentEDJSDocument(data);
        },
        initialData: props?.edjsDocument || undefined,
      });
    }, []);
    return (
      <div>
        <div className="flex flex-column *:flex-1 mt-5">
          <div className="mr-5 ml-5 min-h-[70vh] ">
            <p className="text-3xl m-5">Kreator</p>
            <div className="border-gray-400 border-2 p-3">
              <div id="mail-editor" />
            </div>
          </div>
          <div className="sticky top-0 min-h-[70vh]">
            <p className="text-3xl m-5">Podgląd</p>
            {currentEDJSDocument && (
              <HTMLMaiilPreview html={mailHtmlParser(currentEDJSDocument)} />
            )}
            {!currentEDJSDocument && (
              <div className="border-gray-400 border-2 p-3 m-5 h-[80vh] overflow-y-scroll">
                <p className="text-center text-2xl text-gray-400">
                  Brak treści
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
