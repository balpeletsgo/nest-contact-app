import { Controller, Get, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserResponse } from 'src/response/user.response';
import { WebResponse } from 'src/response/web.response';
import { RequestUserDTO } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Request() req: RequestUserDTO,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.getProfile(req.user.id);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User profile fetched successfully',
      data: result,
    };
  }
}
