export class CreatePhoneRequestDTO {
  contactId: string;
  phoneNumber: string;
}

export class GetPhoneByIdRequestDTO {
  contactId: string;
  phoneId: string;
}
