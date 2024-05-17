import { RecordDetails } from 'src/app/shared';

export interface City {
  _id?: string;
  gov: {
    _id?: string;
    name: string;
  };
  name: string;
  active?: boolean;
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
}
