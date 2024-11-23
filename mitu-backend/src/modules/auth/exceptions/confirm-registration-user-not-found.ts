/**
 * Exception for when a user is not found when trying to confirm registration
 * @export
 * @class ConfirmRegistrationUserNotFound
 * @extends {Error}
 */
export default class ConfirmRegistrationUserNotFound extends Error {
  constructor() {
    super('User not found');
  }
}
