import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRequestDTO } from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactResponse } from 'src/response/contact.response';
import { PhoneResponse } from 'src/response/phone.response';
import { ValidationService } from 'src/validation/validation.service';
import { CreatePhoneRequestDTO } from './../dto/phone.dto';
import { PhoneValidation } from './phone.validation';

@Injectable()
export class PhoneService {
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
    };
  }

  private async isPhoneNumberExists(
    contactId: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const phone = await this.prisma.phone.findFirst({
      where: {
        contactId,
        number: phoneNumber,
      },
    });

    if (phone) {
      throw new HttpException(
        'Phone number already exists for this contact',
        HttpStatus.CONFLICT,
      );
    }

    return false;
  }

  async create(
    user: UserRequestDTO,
    request: CreatePhoneRequestDTO,
  ): Promise<PhoneResponse> {
    const CreatePhoneRequest: CreatePhoneRequestDTO = this.validation.validate(
      PhoneValidation.CreatePhone,
      request,
    );

    const contact = await this.isContactExists(
      user.id,
      CreatePhoneRequest.contactId,
    );
    await this.isPhoneNumberExists(
      CreatePhoneRequest.contactId,
      CreatePhoneRequest.phoneNumber,
    );

    const phone = await this.prisma.phone.create({
      data: {
        contactId: contact.id,
        number: CreatePhoneRequest.phoneNumber,
      },
      select: {
        id: true,
        contactId: true,
        number: true,
        contact: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      id: phone.id,
      contactId: phone.contactId,
      number: phone.number,
      contact: {
        firstName: phone.contact.firstName,
        lastName: phone.contact.lastName || undefined,
      },
    };
  }
}
