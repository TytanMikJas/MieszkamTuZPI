"use strict";


declare module "@editorjs/paragraph" {
    export default class Paragraph implements ToolConstructable {
        save: (blockContent: BlockContent) => BlockContent;
        render: () => HTMLElement;
    }
};

declare module "@editorjs/header" {
    export default class Header implements ToolConstructable {
        save: (blockContent: BlockContent) => BlockContent;
        render: () => HTMLElement;
    }
};

declare module "@editorjs/delimiter" {
    export default class Delimiter implements ToolConstructable {
        save: (blockContent: BlockContent) => BlockContent;
        render: () => HTMLElement;
    }
};

declare module "@editorjs/list" {
    export default class List implements ToolConstructable {
        save: (blockContent: BlockContent) => BlockContent;
        render: () => HTMLElement;
    }
};

declare module "@editorjs/image" {
    export default class ImageTool implements ToolConstructable {
        save: (blockContent: BlockContent) => BlockContent;
        render: () => HTMLElement;
    }
}