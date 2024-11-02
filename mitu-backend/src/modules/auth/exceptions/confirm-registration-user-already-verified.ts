/**
 * Exception for when a user tries to confirm their registration but they are already verified
 * @export
 * @class ConfirmRegistrationUserAlreadyVerified
 * @extends {Error}
 */
export default class ConfirmRegistrationUserAlreadyVerified extends Error {
  constructor() {
    super('User already verified');
  }
}
