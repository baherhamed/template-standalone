import { systemLanguages } from '.';

export interface systemMessage {
  show: boolean;
  titleClass: string;
  title: string;
  message: systemLanguages;
}
