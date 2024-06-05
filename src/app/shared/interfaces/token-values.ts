export interface TokenValues {
  userId: string;
  name: string;
  language: string;
  routesList: string[];
  permissionsList: string[];
  isDeveloper?: boolean;
  userLoggedIn: boolean;
}


export const TokenValuesModel = {
  userId: '',
  name: '',
  language: '',
  routesList: [],
  permissionsList: [],
  isDeveloper: false,
  userLoggedIn: false,
};