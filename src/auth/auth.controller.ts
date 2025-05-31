import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInRequestDTO, SignUpRequestDTO } from 'src/dto/auth.dto';
import { AuthResponse } from 'src/response/auth.response';
import { WebResponse } from 'src/response/web.response';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() request: SignUpRequestDTO,
  ): Promise<WebResponse<AuthResponse>> {
    const result = await this.authService.signUp(request);

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: result,
    };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() request: SignInRequestDTO,
  ): Promise<WebResponse<AuthResponse>> {
    const result = await this.authService.signIn(request);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User signed in successfully',
      data: result,
    };
  }
}
