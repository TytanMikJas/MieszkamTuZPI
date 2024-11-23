/**
 * DTO for badge
 * @export
 * @class BadgeDto
 * @property {string} name - The name of the badge
 * @property {string} icon - The icon of the badge
 * @property {string} primary - The primary color of the badge
 * @property {string} secondary - The secondary color of the badge
 * @example
 * ```ts
 * {
 * name: 'Investor',
 * icon: 'investor.svg',
 * primary: '#FF0000',
 * secondary: '#00FF00'
 * }
 * ```
 */
export default class BadgeDto {
  name: string;
  icon: string;
  primary: string;
  secondary: string;
}
