export enum RenderType {
  alert = 'alert',
  form = 'form',
}

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
