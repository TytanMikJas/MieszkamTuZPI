import { Controller, Injectable } from '@nestjs/common';
import UserService from './user.service';

/**
 * User controller
 * @export
 * @class UserController
 */
@Injectable()
@Controller('user')
export default class UserController {
  /**
   * Creates an instance of UserController.
   * @param {UserService} userService
   * @memberof UserController
   */
  constructor(private readonly userService: UserService) {}
}
