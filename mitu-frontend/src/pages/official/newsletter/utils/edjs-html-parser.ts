import edjsHTML from 'editorjs-html';
import {
  parseHeader,
  parseImage,
  parseList,
  parseParagraph,
} from '../parsers/parsers';
import { parse } from 'path';
import { OutputData } from '@editorjs/editorjs';

const edjsHTMLParser = edjsHTML({
  delimiter: () =>
    '<div style="border-bottom: 0.5px dashed black;width:95%;text-align:center;margin: auto;margin-bottom:10px;">⠀</div>',
  paragraph: (data: any) => parseParagraph(data),
  header: (data: any) => parseHeader(data),
  list: (data: any) => parseList(data),
  image: (data: any) => parseImage(data),
});

export const mailHtmlParser = (data: OutputData) => {
  if (Object.keys(data).length === 0) {
    return '';
  }
  const mailBodyContent = edjsHTMLParser.parse(data).join('');
  const mail = `
    <html>
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <style>
    body {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        line-height: 1.5;
        margin: 0;
        padding: 0;
    }
     a{
        color: #007bff !important;
        text-decoration: underline;
    }
    </style>
    <body>
    ${mailBodyContent}
    </body> `;
  return mail;
};
