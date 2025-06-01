import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreatePhoneRequestDTO,
  UpdatePhoneRequestDTO,
} from 'src/dto/phone.dto';
import { PhoneResponse } from 'src/response/phone.response';
import { WebResponse } from 'src/response/web.response';
import { PhoneService } from './phone.service';

@Controller('contacts/:contactId/phones')
export class PhoneController {
  constructor(private phoneService: PhoneService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPhone(
    @Param('contactId') contactId: string,
    @Body() body: CreatePhoneRequestDTO,
  ): Promise<WebResponse<PhoneResponse>> {
    const result = await this.phoneService.create({
      ...body,
      contactId,
    });

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'Phone number created successfully',
      data: result,
    };
  }

  @Get(':phoneId')
  @HttpCode(HttpStatus.OK)
  async getPhoneById(
    @Param('contactId') contactId: string,
    @Param('phoneId') phoneId: string,
  ): Promise<WebResponse<PhoneResponse>> {
    const result = await this.phoneService.getById({
      contactId,
      phoneId,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Phone number retrieved successfully',
      data: result,
    };
  }

  @Patch(':phoneId')
  @HttpCode(HttpStatus.OK)
  async updatePhone(
    @Param('contactId') contactId: string,
    @Param('phoneId') phoneId: string,
    @Body() body: UpdatePhoneRequestDTO,
  ): Promise<WebResponse<PhoneResponse>> {
    const result = await this.phoneService.update({
      ...body,
      contactId,
      phoneId,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Phone number updated successfully',
      data: result,
    };
  }

  @Delete(':phoneId')
  @HttpCode(HttpStatus.OK)
  async deletePhone(
    @Param('contactId') contactId: string,
    @Param('phoneId') phoneId: string,
  ): Promise<WebResponse<null>> {
    await this.phoneService.delete({
      contactId,
      phoneId,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Phone number deleted successfully',
    };
  }
}
