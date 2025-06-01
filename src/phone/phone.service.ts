import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactResponse } from 'src/response/contact.response';
import { PhoneResponse } from 'src/response/phone.response';
import { ValidationService } from 'src/validation/validation.service';
import {
  CreatePhoneRequestDTO,
  GetPhoneByIdRequestDTO,
  UpdatePhoneRequestDTO,
} from './../dto/phone.dto';
import { PhoneValidation } from './phone.validation';

@Injectable()
export class PhoneService {
  constructor(
    private prisma: PrismaService,
    private validation: ValidationService,
  ) {}

  private async isContactExists(contactId: string): Promise<ContactResponse> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
      },
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

  private async isPhoneExists(
    contactId: string,
    phoneId: string,
  ): Promise<PhoneResponse> {
    const phone = await this.prisma.phone.findFirst({
      where: {
        id: phoneId,
        contactId,
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

    if (!phone) {
      throw new HttpException('Phone number not found', HttpStatus.NOT_FOUND);
    }

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

  async create(request: CreatePhoneRequestDTO): Promise<PhoneResponse> {
    const CreatePhoneRequest: CreatePhoneRequestDTO = this.validation.validate(
      PhoneValidation.CreatePhone,
      request,
    );

    const contact = await this.isContactExists(CreatePhoneRequest.contactId);

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

  async getById(request: GetPhoneByIdRequestDTO): Promise<PhoneResponse> {
    const getPhoneRequest: GetPhoneByIdRequestDTO = this.validation.validate(
      PhoneValidation.GetPhoneById,
      request,
    );

    const phone = await this.isPhoneExists(
      getPhoneRequest.contactId,
      getPhoneRequest.phoneId,
    );

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

  async update(request: UpdatePhoneRequestDTO): Promise<PhoneResponse> {
    const updatePhoneRequest: UpdatePhoneRequestDTO = this.validation.validate(
      PhoneValidation.UpdatePhone,
      request,
    );

    await this.isContactExists(updatePhoneRequest.contactId);

    const phone = await this.isPhoneExists(
      updatePhoneRequest.contactId,
      updatePhoneRequest.phoneId,
    );

    await this.isPhoneNumberExists(
      phone.contactId,
      updatePhoneRequest.phoneNumber as string,
    );

    const updatedPhone = await this.prisma.phone.update({
      where: {
        id: phone.id,
      },
      data: {
        number: updatePhoneRequest.phoneNumber,
      },
    });

    return {
      id: updatedPhone.id,
      contactId: updatedPhone.contactId,
      number: updatedPhone.number,
      contact: {
        firstName: phone.contact.firstName,
        lastName: phone.contact.lastName || undefined,
      },
    };
  }

  async delete(request: GetPhoneByIdRequestDTO): Promise<void> {
    const deletePhoneRequest: GetPhoneByIdRequestDTO = this.validation.validate(
      PhoneValidation.GetPhoneById,
      request,
    );

    await this.isPhoneExists(
      deletePhoneRequest.contactId,
      deletePhoneRequest.phoneId,
    );

    await this.prisma.phone.delete({
      where: {
        id: deletePhoneRequest.phoneId,
        contactId: deletePhoneRequest.contactId,
      },
    });
  }
}
