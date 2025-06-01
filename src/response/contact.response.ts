export class ContactResponse {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phones?: Phone[];
}

export class Phone {
  number: string;
}
