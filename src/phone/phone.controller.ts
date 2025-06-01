import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { PhoneService } from './phone.service';
import { CreatePhoneRequestDTO } from 'src/dto/phone.dto';
import { UserRequest } from 'src/dto/user.dto';
import { WebResponse } from 'src/response/web.response';
import { PhoneResponse } from 'src/response/phone.response';

@Controller('contacts/:contactId/phones')
export class PhoneController {
  constructor(private phoneService: PhoneService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPhone(
    @Request() req: UserRequest,
    @Param('contactId') contactId: string,
    @Body() body: CreatePhoneRequestDTO,
  ): Promise<WebResponse<PhoneResponse>> {
    const result = await this.phoneService.create(req.user, {
      ...body,
      contactId,
    });

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'Phone created successfully',
      data: result,
    };
  }

  @Get(':phoneId')
  @HttpCode(HttpStatus.OK)
  async getPhoneById(
    @Request() req: UserRequest,
    @Param('contactId') contactId: string,
    @Param('phoneId') phoneId: string,
  ): Promise<WebResponse<PhoneResponse>> {
    const result = await this.phoneService.getById(req.user, {
      contactId,
      phoneId,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Phone retrieved successfully',
      data: result,
    };
  }
}
