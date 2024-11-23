export default interface BadgeDto {
  name: string;
  icon: string;
  primary: string;
  secondary: string;
}

export type BadgeInputDto = Record<'value' | 'label', string>;
