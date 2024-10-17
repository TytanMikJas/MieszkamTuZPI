
export default class ConfirmRegistrationUserAlreadyVerified extends Error {
  constructor() {
    super('User already verified')
  }
}