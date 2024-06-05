import { RecordDetails } from 'src/app/shared';
import { Permission } from '.';

export interface Route {
  _id?: string;
  name: string;
  ar: string;
  en: string;
  permissionsList: Permission[];
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
  active?: boolean;
}


export const RouteModel = {
  name: '',
  ar: '',
  en: '',
  permissionsList: [],
  active: true,

};