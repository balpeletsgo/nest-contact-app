export class CreateContactRequestDTO {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
}

export class SearchContactRequestDTO {
  name?: string;
  size?: number;
  page?: number;
}
