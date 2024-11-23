/**
 * Data transfer object for public user data
 * @export
 * @class PublicUserDto
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} role
 * @param {string} avatar
 * @param {boolean} forceChangePassword
 */
export default class PublicUserDto {
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  forceChangePassword: boolean;
}
