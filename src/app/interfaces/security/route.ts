import { RecordDetails } from 'src/app/shared';
import { Permission } from '.';

export interface Route {
  _id?: string;
  name: string;
  ar: string;
  en: string;
  permissionsList: Permission[];
  active: boolean;
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
}
