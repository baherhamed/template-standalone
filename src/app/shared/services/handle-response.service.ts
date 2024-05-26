import { Injectable } from '@angular/core';
import { NotificationService } from '.';
import { IResponse, site } from '..';

@Injectable({
  providedIn: 'root',
})
export class HandleResponseService {
  constructor(private notification: NotificationService) {}
  checkResponse = async (res: IResponse) => {
    const success = res?.success || res?.body?.success;
    const statusCode = res?.statusCode;
    const message = res?.message || res?.body?.message;
    const data = res?.data || res?.body?.data;
    const paginationInfo = res?.paginationInfo;

    if (success && statusCode === site.responseStatusCodes.add) {
      this.notification.success(message);
    }

    if (success && statusCode === site.responseStatusCodes.update) {
      this.notification.success(message);
    }

    if (success && statusCode === site.responseStatusCodes.delete) {
      this.notification.warning(message);
    }

    if (success && statusCode === site.responseStatusCodes.search) {
      this.notification.success(message);
    }

    if (!success && statusCode === site.responseStatusCodes.error) {
      this.notification.error(message);
    }

    if (!success && statusCode === site.responseStatusCodes.noData) {
      this.notification.info(message);
    }

    if (!success && statusCode === site.responseStatusCodes.exisit) {
      this.notification.info(message);
    }

    if (!success && statusCode === site.responseStatusCodes.missingData) {
      this.notification.info(message);
    }
    if (!success && statusCode === site.responseStatusCodes.loggedInFail) {
      this.notification.info(message);
    }

    if (statusCode === site.responseStatusCodes.unauthorized) {
      this.notification.warning(message);
      localStorage.removeItem(site.token);
      localStorage.removeItem(site.routesList);
      localStorage.removeItem(site.permissionsList);
      const reassignRoute = setTimeout(() => {
        location.assign('/login');
        clearTimeout(reassignRoute);
      }, 3000);
    }

    if (data) {
      return { success, data };
    } else {
      return { data, paginationInfo };
    }
  };
}
