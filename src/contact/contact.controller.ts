import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CreateContactRequestDTO } from 'src/dto/contact.dto';
import { UserRequest } from 'src/dto/user.dto';
import { ContactResponse } from 'src/response/contact.response';
import { WebResponse } from 'src/response/web.response';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: UserRequest,
    @Body() request: CreateContactRequestDTO,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(req.user, request);

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'Contact created successfully',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Request() req: UserRequest,
    @Query('name') name?: string,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    const query = {
      name,
      size: size || 10,
      page: page || 1,
    };

    return this.contactService.getAll(req.user, query);
  }
}
