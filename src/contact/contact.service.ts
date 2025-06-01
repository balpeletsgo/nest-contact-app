import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateContactRequestDTO,
  SearchContactRequestDTO,
  UpdateContactRequestDTO,
} from 'src/dto/contact.dto';
import { UserRequestDTO } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactResponse } from 'src/response/contact.response';
import { WebResponse } from 'src/response/web.response';
import { ValidationService } from 'src/validation/validation.service';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
  ) {}

  private async isContactExists(
    userId: string,
    contactId: string,
  ): Promise<ContactResponse> {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        Phone: {
          select: {
            number: true,
          },
        },
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', 404);
    }

    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName || undefined,
      email: contact.email || undefined,
      phones: contact.Phone.map((p) => ({
        number: p.number,
      })),
    };
  }

  async create(
    user: UserRequestDTO,
    request: CreateContactRequestDTO,
  ): Promise<ContactResponse> {
    const createContactRequest: CreateContactRequestDTO =
      this.validation.validate(ContactValidation.CreateContact, request);

    const contact = await this.prisma.contact.create({
      data: {
        firstName: createContactRequest.firstName,
        lastName: createContactRequest.lastName,
        email: createContactRequest.email,
        userId: user.id,
      },
    });

    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName || undefined,
      email: contact.email || undefined,
    };
  }

  async getAll(
    user: UserRequestDTO,
    request: SearchContactRequestDTO,
  ): Promise<WebResponse<ContactResponse[]>> {
    const searchContactRequest: SearchContactRequestDTO =
      this.validation.validate(ContactValidation.SearchContact, request);

    const filters: any[] = [];

    if (searchContactRequest.query) {
      filters.push({
        OR: [
          {
            firstName: {
              contains: searchContactRequest.query,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: searchContactRequest.query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: searchContactRequest.query,
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

  async getById(
    user: UserRequestDTO,
    contactId: string,
  ): Promise<ContactResponse> {
    console.log({ contactId });

    const contactIdRequest: { contactId: string } = this.validation.validate(
      ContactValidation.GetContactById,
      {
        contactId,
      },
    );

    const contact = await this.isContactExists(
      user.id,
      contactIdRequest.contactId,
    );

    return contact;
  }

  async update(
    user: UserRequestDTO,
    request: UpdateContactRequestDTO,
  ): Promise<ContactResponse> {
    const updateContactRequest: UpdateContactRequestDTO =
      this.validation.validate(ContactValidation.UpdateContact, {
        ...request,
        contactId: request.contactId,
      });

    await this.isContactExists(user.id, updateContactRequest.contactId);

    const contact = await this.prisma.contact.update({
      where: {
        id: updateContactRequest.contactId,
        userId: user.id,
      },
      data: {
        firstName: updateContactRequest.firstName,
        lastName: updateContactRequest.lastName,
        email: updateContactRequest.email,
      },
    });

    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName || undefined,
      email: contact.email || undefined,
    };
  }

  async delete(user: UserRequestDTO, contactId: string): Promise<void> {
    await this.isContactExists(user.id, contactId);

    await this.prisma.contact.delete({
      where: {
        id: contactId,
        userId: user.id,
      },
    });
  }
}
