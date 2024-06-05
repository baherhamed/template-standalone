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
export const CityModel = {
  // _id: '',
  gov: {
    _id: '',
    name: '',
  },
  name: '',
  code: '',
  active: true,
  // addInfo: {},
  // lastUpdateInfo: {}
};