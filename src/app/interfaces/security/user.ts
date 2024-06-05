import { RecordDetails } from 'src/app/shared';
import { Permission, Route } from '.';

export interface User {
  _id?: string;
  name: string;
  mobile: string;
  email: string;
  password?: string;
  language: {
    _id: string;
    name: string;
  };
  routesList: Route[];
  permissionsList?: Permission[];
  addInfo?: RecordDetails;
  lastUpdateInfo?: RecordDetails;
  active?: boolean;
}

export const UserModel = {
  name: '',
  mobile: '',
  email: '',
  password: '',
  language: {
    _id: '',
    name: '',
  },
  routesList: [],
  permissionsList: [],
  active: true,
};

