import { RecordDetails } from 'src/app/shared';

export interface Gov {
  _id?: string;
  name: string;
  code: string;
  active?: boolean;
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
}

export const GovModel = {
  // _id: '',
  name: '',
  code: '',
  active: true,
  // addInfo: {},
  // lastUpdateInfo: {}
};
