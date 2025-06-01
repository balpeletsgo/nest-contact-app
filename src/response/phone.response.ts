export class PhoneResponse {
  id: string;
  contactId: string;
  number: string;
  contact: {
    firstName: string;
    lastName?: string;
  };
}
