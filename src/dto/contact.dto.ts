export class CreateContactRequestDTO {
  firstName: string;
  lastName?: string;
  email?: string;
}

export class UpdateContactRequestDTO {
  contactId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class GetContactByIdRequestDTO {
  contactId: string;
}

export class SearchContactRequestDTO {
  query?: string;
  size?: number;
  page?: number;
}
