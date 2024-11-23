export enum RenderType {
  alert = 'alert',
  form = 'form',
}

/**
 * Exception output dto
 * @param {string[]} messages
 * @param {string} field
 * @param {RenderType} type
 * @returns {ExceptionOutputDto}
 * @constructor
 */
export class ExceptionOutputDto {
  field: string;
  messages: string[];
  type: RenderType = RenderType.alert;
  constructor(
    messages: string[],
    field: string = '',
    type: RenderType = RenderType.alert,
  ) {
    this.field = field;
    this.messages = messages;
    this.type = type;
  }
}
