import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
    @Query('q') query?: string,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    const searchQuery = {
      query: query || undefined,
      size: size || 10,
      page: page || 1,
    };

    return this.contactService.getAll(req.user, searchQuery);
  }

  @Get(':contactId')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Request() req: UserRequest,
    @Param('contactId') contactId: string,
  ): Promise<WebResponse<ContactResponse>> {
    console.log({ contactId });

    const result = await this.contactService.getById(req.user, contactId);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Contact retrieved successfully',
      data: result,
    };
  }

  @Patch(':contactId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() req: UserRequest,
    @Param('contactId') contactId: string,
    @Body() request: CreateContactRequestDTO,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.update(req.user, {
      ...request,
      contactId,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Contact updated successfully',
      data: result,
    };
  }

  @Delete(':contactId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Request() req: UserRequest,
    @Param('contactId') contactId: string,
  ): Promise<WebResponse<void>> {
    await this.contactService.delete(req.user, contactId);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Contact deleted successfully',
    };
  }
}
