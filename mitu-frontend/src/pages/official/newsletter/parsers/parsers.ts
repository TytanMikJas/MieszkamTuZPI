import { parseCssProperties } from '../utils/css-properties-parser';

interface Block<V> {
  type: string;
  data: V;
}

const paragraphStyle = parseCssProperties({
  'font-size': '16px',
  'line-height': '1.5',
  'text-align': 'justify',
  margin: '0',
  padding: '0',
  'margin-bottom': '10px',
});

interface ParagraphData {
  text: string;
}

export function parseParagraph(block: Block<ParagraphData>): string {
  return `<p style="${paragraphStyle}">${block.data.text}</p>`;
}

const headerStyle = (level: number) =>
  parseCssProperties({
    'font-size': `${48 - level * 8}px`,
    'line-height': '1.5',
    margin: '0',
    'font-weight': 'bold',
    padding: '0',
  });

interface HeaderData {
  text: string;
  level: number;
}

export function parseHeader(block: Block<HeaderData>): string {
  return `<h${block.data.level} style="${headerStyle(block.data.level)}">${block.data.text}</h${block.data.level}>`;
}

const olStyle = parseCssProperties({
  'list-style-type': 'decimal',
  margin: '0',
  'margin-left': '30px',
  'margin-bottom': '10px',
  'margin-top': '10px',
  padding: '0',
});

const ulStyle = parseCssProperties({
  'list-style-type': 'disc',
  margin: '0',
  'margin-left': '30px',
  'margin-bottom': '10px',
  'margin-top': '10px',
  padding: '0',
});

interface ListData {
  items: string[];
  style: 'ordered' | 'unordered';
}

export function parseList(block: Block<ListData>): string {
  if (block.data.style === 'ordered') {
    return `<ol style="${olStyle}">${block.data.items.map((item) => `<li>${item}</li>`).join('')}</ol>`;
  } else {
    return `<ul style="${ulStyle}">${block.data.items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  }
}

const createImageStyle = function (
  withBorder: boolean,
  withBackground: boolean,
  stretched: boolean,
): string {
  const style = {
    'max-width': '100%',
    height: 'auto',
    margin: '0',
    padding: '0',
    display: 'block',
    'margin-left': 'auto',
    'margin-right': 'auto',
  } as unknown as Record<string, string>;

  if (withBorder) {
    style['border'] = '1px solid #000';
    style['padding'] = '10px';
    style['border-radius'] = '5px';
  }

  if (withBackground) {
    style['background-color'] = '#f9f9f9';
  }

  if (stretched) {
    style['width'] = '100%';
  }

  return parseCssProperties(style);
};

const imageCaptionStyle = parseCssProperties({
  'text-align': 'center',
  'font-style': 'italic',
});

interface ImageData {
  file: {
    url: string;
  };
  caption: string;
  withBorder: boolean;
  withBackground: boolean;
  stretched: boolean;
}

export function parseImage(block: Block<ImageData>): string {
  //use all prperties from imageData
  //display centered image with caption in italics on the bottom

  const imageStyle: string = createImageStyle(
    block.data.withBorder,
    block.data.withBackground,
    block.data.stretched,
  );

  return `
  <figure>
    <img src="${block.data.file.url}" style="${imageStyle}" />
    <figcaption style="${imageCaptionStyle}">${block.data.caption}</figcaption>
  </figure>
  `;
}
