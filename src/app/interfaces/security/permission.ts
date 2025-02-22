import { RecordDetails } from 'src/app/shared';

export interface Permission {
  _id?: string;
  permission_id?: string;
  routeId?: string;
  name: string;
  ar: string;
  en: string;
  active?: boolean;
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
}


export const PermissionModel = {
  name: '',
  ar: '',
  en: '',
  active: true,
};