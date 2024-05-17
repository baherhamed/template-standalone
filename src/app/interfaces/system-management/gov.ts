import { RecordDetails } from 'src/app/shared';

export interface Gov {
  _id?: string;
  name: '';
  code: '';
  active?: boolean;
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
}
