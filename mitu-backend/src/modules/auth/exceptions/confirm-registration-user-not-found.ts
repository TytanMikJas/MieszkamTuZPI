export default class ConfirmRegistrationUserNotFound extends Error {
  constructor() {
    super('User not found');
  }
}