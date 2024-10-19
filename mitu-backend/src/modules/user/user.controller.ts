import { Controller, Injectable } from '@nestjs/common';
import UserService from './user.service';

@Injectable()
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}
}
