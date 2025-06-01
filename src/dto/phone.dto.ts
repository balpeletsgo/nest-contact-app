export class CreatePhoneRequestDTO {
  contactId: string;
  phoneNumber: string;
}

export class GetPhoneByIdRequestDTO {
  contactId: string;
  phoneId: string;
}

export class UpdatePhoneRequestDTO {
  contactId: string;
  phoneId: string;
  phoneNumber?: string;
}
