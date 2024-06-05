/* eslint-disable @typescript-eslint/no-explicit-any */
// import { HttpHeaders } from '@angular/common/http';
import { Request } from 'express';
import { pagination } from './pagination';

import { environment } from 'src/environments/environment';

import devtools from 'devtools-detect';
import { HttpHeaders } from '@angular/common/http';

export const site = {
  companyInfo: {
    address:
      'السنطة ش الجمهورية برج الكمال الدور الثاني بجوار مكتب بريد السنطة فرعي',
    phone: '0404475000',
    mobile: '01065055550',
  },
  api: '/api/',
  // modules: {
  //   security: 'security/',
  //   systemManagement: 'systemManagement/',
  // },
  appsRoutes: {
    login: 'login',
    add: 'add',
    update: 'update',
    search: 'search',
    delete: 'delete',
    getAll: 'getAll',
    getActive: 'getActive',
    view: 'view',
    getCitiesByGov: 'getCitiesByGov',
    changePassword: 'changePassword',
    logout: 'logout',
  },
  apps: {
    home: 'home',
    login: 'login',
    languages: 'languages/',
    routes: 'routes/',
    users: 'users/',
    govs: 'govs/',
    cities: 'cities/',
    globalSystemSetting: 'globalSystemSetting/',
    json: 'json/',
  },
  token: 'token',
  routesList: 'routesList',
  permissionsList: 'permissionsList',
  currentLangValue: 'lang',
  language: { ar: 'ar', en: 'en' },
  globalSetting: 'globalSetting',

  requestHeaders: () => {
    const token = localStorage.getItem(site.token);
    const language = localStorage.getItem(site.currentLangValue);

    const newHeader = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('accept-language', `${language}`)
      .set('Authorization', `Bearer ${token}`);

    return { headers: newHeader, observe: 'response' };
  },
  requestHeadersForUpload: () => {
    const token = localStorage.getItem(site.token);
    const language = localStorage.getItem(site.currentLangValue);
    const newHeader = new HttpHeaders()
      .set('accept-language', `${language}`)
      .set('Authorization', `Bearer ${token}`);

    return { headers: newHeader };
  },
  requestHeadersForLogin: () => {
    const language = localStorage.getItem(site.currentLangValue);
    const newHeader = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('accept-language', `${language}`);

    return { headers: newHeader };
  },
  // requestHeaders: () => {
  //   const token = localStorage.getItem('token');
  //   const language = localStorage.getItem('language');
  //   const newHeader = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('accept-language', `${language}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   return { headers: newHeader, observe: 'response' };
  // },
  // requestHeadersForLogin: () => {
  //   const language = localStorage.getItem('language');
  //   const newHeader = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('accept-language', `${language}`);

  //   return { headers: newHeader };
  // },
  // requestHeadersForUpload: () => {
  //   const language = localStorage.getItem('language');
  //   const token = localStorage.getItem('token');
  //   const newHeader = new HttpHeaders()
  //     .set('accept-language', `${language}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   return { headers: newHeader };
  // },
  notificationType: {
    error: 'error',
    success: 'success',
    info: 'info',
    deleted: 'deleted',
    warning: 'warning',
  },
  operation: {
    add: 'add',
    update: 'update',
    search: 'search',
    getAll: 'getAll',
    result: 'result',
    close: 'close',
  },
  messageTitle: {
    error: {
      ar: 'خطأ',
      en: 'Error',
    },
    success: {
      ar: 'نجاح',
      en: 'Success',
    },
    info: {
      ar: 'معلومات',
      en: 'Info',
    },
    deleted: {
      ar: 'حذف',
      en: 'Deleted',
    },
    warning: {
      en: 'Warining',
      ar: 'تحذير',
    },
  },
  confirmMessage: {
    ar: 'هل أنت متأكد?',
    en: 'Are You Sure?',
  },
  removeElement: (array: any[], elem: any): any => {
    const itm = array.indexOf(elem);
    if (itm > -1) {
      array.splice(itm, 1);
    }
  },
  spliceElementToUpdate: (array: any[], elem: { _id: any; }): any => {
    array.forEach((itm, i) => {
      if (itm._id === elem._id) {
        array.splice(i, 1, elem);
      }
    });
  },
  spliceElementToDelete: (array: any[], elem: any): any => {
    array.forEach(function (itm, i): any {
      if (itm._id === elem._id) {
        return array.splice(i, 1, elem);
      }
    });
  },
  setDaysList: () => {
    const daysList = [];
    for (let i = 1; i < 32; i++) {
      daysList.push(i);
    }
    return daysList;
  },
  setMonthsList: () => {
    const monthsList = [];
    for (let i = 1; i < 13; i++) {
      monthsList.push(i);
    }
    return monthsList;
  },
  setYearsList: () => {
    const yearsList = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i < currentYear + 15; i++) {
      yearsList.push(i);
    }
    return yearsList;
  },
  disableDeveloperTools: () => {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    if (devtools.isOpen) {
      localStorage.removeItem(site.token);
      localStorage.removeItem(site.routesList);
      localStorage.removeItem(site.permissionsList);
      const currentUrl = environment.route;
      if (window.location.href.includes(currentUrl)) {
        window.location.replace('http://www.google.com');
      }
    }
  },
  convertDate: (date: string) => {
    return new Date(date).toISOString().slice(0, 10);
  },
  responseStatusCodes: {
    add: 700,
    update: 701,
    delete: 702,
    getAll: 703,
    getActive: 704,
    search: 705,
    noData: 706,
    error: 707,
    missingData: 708,
    unauthorized: 401,
    exisit: 709,
    loggedOut: 710,
    loggedInFail: 711,
    loggedInSuccess: 712,
    globalSetting: 713,
    view: 1000,
  },
  pagination: { page: 1, limit: 10 },
  systemMessage: {
    show: false,
    titleClass: '',
    title: '',
    message: { ar: '', en: '' },
  },
  dialogNames: {
    add: "add",
    update: "update",
    search: "search",
    details: "details",
    showMessage: "showMessage",
  }
};
