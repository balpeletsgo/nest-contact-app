import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
} from '@nestjs/common';
import { UpdateProfileRequestDTO, UserRequest } from 'src/dto/user.dto';
import { UserResponse } from 'src/response/user.response';
import { WebResponse } from 'src/response/web.response';
import { UserService } from 'src/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async get(@Request() req: UserRequest) {
    const result = await this.userService.getProfile(req.user);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User profile fetched successfully',
      data: result,
    };
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() req: UserRequest,
    @Body() request: UpdateProfileRequestDTO,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updateProfile(req.user, request);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User profile updated successfully',
      data: result,
    };
  }
}
