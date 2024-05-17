import { IResponse, site } from '..';

export async function validateResponse(res: IResponse) {
  const success = res?.success || res?.body?.success;
  const data = res?.data || res?.body?.data;
  const message = res?.message || res?.body?.message;
  const statusCode = res?.status;

  if (statusCode === 401) {
    localStorage.removeItem(site.token);
    localStorage.removeItem(site.routesList);
    localStorage.removeItem(site.permissionsList);
    location.assign('/login');
  }

  return {
    message,
    data,
    success,
  };
}
