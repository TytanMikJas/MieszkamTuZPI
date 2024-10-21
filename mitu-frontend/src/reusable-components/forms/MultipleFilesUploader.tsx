import { forwardRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import {
  IMAGE_MIME_TYPES,
  DOC_MIME_TYPES,
  TD_MIME_TYPES,
  IMAGE_INVESTMENT_QUANTITY_LIMIT,
  DOC_INVESTMENT_QUANTITY_LIMIT,
  TD_INVESTMENT_QUANTITY_LIMIT,
} from '@/constants';

interface MultipleFilesUploaderProps {
  allowMultiple?: boolean; // Whether to allow multiple file selection
  maxFiles?: number; // Maximum number of files to allow
  onInit?: () => void; // Callback for when the FilePond instance is initialized
  // You can extend this interface to include other FilePond properties as needed
  labelIdle?: string;
  uploadedFiles: File[];
  acceptedFileTypes: string[];
  setUploadedFiles: (files: File[]) => void;
}

registerPlugin(FilePondPluginFileValidateType);

const MultipleFilesUploader = forwardRef<FilePond, MultipleFilesUploaderProps>(
  (
    {
      allowMultiple = true,
      maxFiles = 3,
      onInit,
      uploadedFiles,
      setUploadedFiles,
      acceptedFileTypes,
    },
    ref,
  ) => {
    const fileValidateTypeDetectType = (source: File, type: any) =>
      new Promise((resolve, reject) => {
        const arr = IMAGE_MIME_TYPES.includes(source.type)
          ? IMAGE_MIME_TYPES
          : DOC_MIME_TYPES.includes(source.type)
            ? DOC_MIME_TYPES
            : TD_MIME_TYPES.includes(source.type)
              ? TD_MIME_TYPES
              : [];

        const max = IMAGE_MIME_TYPES.includes(source.type)
          ? IMAGE_INVESTMENT_QUANTITY_LIMIT
          : DOC_MIME_TYPES.includes(source.type)
            ? DOC_INVESTMENT_QUANTITY_LIMIT
            : TD_MIME_TYPES.includes(source.type)
              ? TD_INVESTMENT_QUANTITY_LIMIT
              : 0;

        const count = uploadedFiles.filter((f) => arr.includes(f.type)).length;

        if (count >= max) {
          reject(`Przekroczono limit plików typu ${source.type}`);
        }

        resolve(type);
      });

    return (
      <FilePond
        ref={ref}
        files={uploadedFiles}
        onupdatefiles={(fileItems) => {
          if (fileItems.length != uploadedFiles.length) {
            setUploadedFiles(
              fileItems.map((f) => new File([f.file], f.filename)),
            );
          }
        }}
        allowMultiple={allowMultiple}
        maxFiles={maxFiles}
        oninit={onInit}
        dropOnPage={true}
        credits={false}
      />
    );
  },
);

export default MultipleFilesUploader;
