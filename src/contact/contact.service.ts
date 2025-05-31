import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateContactRequestDTO,
  SearchContactRequestDTO,
} from 'src/dto/contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation.service';
import { ContactValidation } from './contact.validation';
import { UserRequestDTO } from 'src/dto/user.dto';
import { ContactResponse } from 'src/response/contact.response';
import { WebResponse } from 'src/response/web.response';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
  ) {}

  async isUserExists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return true;
  }

  async create(
    user: UserRequestDTO,
    request: CreateContactRequestDTO,
  ): Promise<ContactResponse> {
    await this.isUserExists(user.id);

    const createContactRequest: CreateContactRequestDTO =
      this.validation.validate(ContactValidation.CreateContact, request);

    const contact = await this.prisma.contact.create({
      data: {
        firstName: createContactRequest.firstName,
        lastName: createContactRequest.lastName,
        email: createContactRequest.email,
        phone: createContactRequest.phone,
        userId: user.id,
      },
    });

    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName || undefined,
      email: contact.email || undefined,
      phone: contact.phone,
    };
  }

  async getAll(
    user: UserRequestDTO,
    request: SearchContactRequestDTO,
  ): Promise<WebResponse<ContactResponse[]>> {
    await this.isUserExists(user.id);

    const searchContactRequest: SearchContactRequestDTO =
      this.validation.validate(ContactValidation.SearchContact, request);

    const filters: any[] = [];

    if (searchContactRequest.name) {
      filters.push({
        OR: [
          {
            firstName: {
              contains: searchContactRequest.name,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchContactRequest.name,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    const size = searchContactRequest.size || 10;
    const page = searchContactRequest.page || 1;

    const contacts = await this.prisma.contact.findMany({
      where: {
        userId: user.id,
        AND: filters,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: size,
      skip: (page - 1) * size,
    });

    const total = await this.prisma.contact.count({
      where: {
        userId: user.id,
        AND: filters,
      },
    });

    const totalPages = Math.ceil(total / size);

    return {
      success: true,
      status: 200,
      message: 'Contacts retrieved successfully',
      data: contacts.map((contact) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName || undefined,
        email: contact.email || undefined,
        phone: contact.phone,
      })),
      pagination: {
        total_items: total,
        size: size,
        current_page: page,
        has_next_page: page < totalPages,
        has_previous_page: page > 1,
        next_page: page < totalPages ? page + 1 : null,
        previous_page: page > 1 ? page - 1 : null,
        total_pages: totalPages || 1,
      },
    };
  }
}
