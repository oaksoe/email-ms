export interface MailPayload {
  to: string;
  subject: string;
  content: string;
}

export class EventPayload {
  users: { id: string, username: string }[];
  subject: string;
  content: string;
}

export interface Message {
  to: string;
  from : string;
  subject: string;
  text: string;
  html: string;
}
