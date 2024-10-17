import {
  Controller,
  Post,
  Body,
  UseGuards,
  Response,
  Get,
  Patch,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { SuccessMessage } from 'src/decorators/success-message/success-message.decorator';
import CreateUserInputDto from '../user/dto/create-user.input';
import UserService from '../user/user.service';
import { LocalAuthGuard } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { Response as Res } from 'express';
import UserInternalDto from '../user/dto/user.internal';
import { JWTAuthGuard } from './strategies/jwt.strategy';
import { MeDto } from './dto/me.output';
import { User } from './decorators/user.decorator';
import {
  DELETE_USER_ACCOUNT,
  SIGN_IN_MSG,
  SIGN_UP_MSG,
  SUCCESS_PSWD_RESET,
  UPDATE_USER_EMAIL,
  UPDATE_USER_INFO,
  UPDATE_USER_PASSWORD,
} from 'src/strings';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenAuthGuard } from './strategies/refresh-token.strategy';
import UpdateUserInfoInputDto from '../user/dto/update-user-info.input';
import UpdateUserPasswordInputDto from '../user/dto/update-user-password.input';
import UpdateUserEmailInputDto from '../user/dto/update-user-email.input';
import DeleteAccountInputDto from '../user/dto/delete-account-input-dto';
import ForceChangePasswordInputDto from './dto/force-change-password.input';
import { ConfigService } from '@nestjs/config';
import ConfirmRegistrationUserNotFound from './exceptions/confirm-registration-user-not-found';
import ConfirmRegistrationUserAlreadyVerified from './exceptions/confirm-registration-user-already-verified';
import ChangeForgottenPasswordInputDto from './dto/change-forgotten-password-dto.input';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
@Controller('auth')
@ApiTags('auth')
export default class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.frontendPublicUrl = configService.get<string>('FRONTEND_PUBLIC_URL');
  }
  private frontendPublicUrl: string;

  @SuccessMessage(SIGN_UP_MSG)
  @Post('signUp')
  async signUp(@Body() body: CreateUserInputDto): Promise<void> {
    return this.userService.create(body);
  }

  @SuccessMessage(SIGN_IN_MSG)
  @UseGuards(LocalAuthGuard)
  @Post('signIn')
  async signIn(
    @User() user: UserInternalDto,
    @Response({ passthrough: true }) res: Res,
  ): Promise<MeDto> {
    console.log(user);
    const signInOutputDto = await this.authService.signIn(user);
    res.cookie('refreshToken', signInOutputDto.refreshToken, {
      httpOnly: true,
      secure: false, //it can be false because we won't be using https in production
      path: '/',
    });
    res.cookie('accessToken', signInOutputDto.accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @SuccessMessage(UPDATE_USER_INFO)
  @Patch('updateUserInfo')
  @UseGuards(JWTAuthGuard)
  async updateUserInfo(
    @User() user: UserInternalDto,
    @Body() body: UpdateUserInfoInputDto,
  ): Promise<void> {
    await this.userService.updateInfo(user.id, body);
  }

  @SuccessMessage(UPDATE_USER_PASSWORD)
  @Patch('updateUserPassword')
  @UseGuards(JWTAuthGuard)
  async updateUserPassword(
    @User() user: UserInternalDto,
    @Body() body: UpdateUserPasswordInputDto,
  ): Promise<void> {
    await this.userService.updatePassword(user.id, body);
  }

  @SuccessMessage(UPDATE_USER_EMAIL)
  @Patch('updateUserEmail')
  @UseGuards(JWTAuthGuard)
  async updateUserEmail(
    @User() user: UserInternalDto,
    @Body() body: UpdateUserEmailInputDto,
  ): Promise<void> {
    await this.userService.updateEmail(user.id, body);
  }

  @SuccessMessage(DELETE_USER_ACCOUNT)
  @Post('deleteUserAccount')
  @UseGuards(JWTAuthGuard)
  async DeleteUserAccount(
    @User() user: UserInternalDto,
    @Body() body: DeleteAccountInputDto,
  ) {
    await this.userService.deteleUser(user.id, body);
  }

  @Post('refreshToken')
  @UseGuards(RefreshTokenAuthGuard)
  async refreshToken(
    @Response({ passthrough: true }) res: Res,
    @User() user: UserInternalDto,
  ): Promise<void> {
    const signInOutputDto = await this.authService.signIn(user);
    res.cookie('refreshToken', signInOutputDto.refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
    });
    res.cookie('accessToken', signInOutputDto.accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
    });
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  async me(@User() user: UserInternalDto): Promise<MeDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @Post('logout')
  async logout(@Response({ passthrough: true }) res: Res): Promise<void> {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
  }

  @UseGuards(JWTAuthGuard)
  @SuccessMessage(SUCCESS_PSWD_RESET)
  @Patch('forceResetPassword')
  async changePassword(
    @User() user: UserInternalDto,
    @Body() body: ForceChangePasswordInputDto,
  ): Promise<void> {
    await this.authService.forceChangePassword(user, body);
  }

  @Post('resend-confirmation-email')
  async sendConfirmationEmail(@Query('email') email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    await this.authService.createConfirmation(user);
  }

  @Get('confirm-registration')
  async confirmRegistration(
    @Query('token') token: string,
    @Response() res,
  ): Promise<void> {
    console.log(token);
    try {
      await this.authService.confirmRegistration(token);
    } catch (e) {
      if (e instanceof ConfirmRegistrationUserNotFound) {
        res.redirect(
          this.frontendPublicUrl +
            '/mapa/potwierdzenie-rejestracji-uzytkownik-nie-istnieje',
        );
        return;
      } else if (e instanceof ConfirmRegistrationUserAlreadyVerified) {
        res.redirect(
          this.frontendPublicUrl +
            '/mapa/potwierdzenie-rejestracji-uzytkownik-juz-zostal-potwierdzony',
        );
        return;
      }
    }
    res.redirect(this.frontendPublicUrl + '/mapa/login');
  }

  @Post('create-forgot-password-token')
  async createForgotPasswordToken(@Query('email') email: string): Promise<void> {
    if(!email){
      return;
    }
    const user = await this.userService.findByEmail(email);
    //explicitly dont say if operation succeded
    if (!user) {
      return;
    }
    try {
      await this.authService.createChangePasswordToken(user);
    } catch (e) {
      this.logger.error(e);
    }
  }

  @Post('forgot-password')
  @SuccessMessage('Pomyślnie zmieniono hasło')
  async changeForgottenPassword(@Body() body: ChangeForgottenPasswordInputDto): Promise<void> {
    await this.authService.changeForgottenPassword(body);
  }

  @Get('validate-forgot-password-token')
  async validateForgotPasswordToken(@Query('token') token: string): Promise<boolean> {
    if (!token) {
      throw new SimpleBadRequest('token must be provided as query param');
    }
    return await this.authService.validateForgotPasswordToken(token);
  }
}
