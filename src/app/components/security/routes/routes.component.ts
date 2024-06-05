/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Permission, PermissionModel, Route, RouteModel } from 'src/app/interfaces';
import { RoutesService } from 'src/app/services';

import {
  inputsLength,
  getTokenValue,
  site,
  exportToExcel,
  IResponse,
  ResponsePaginationData,
  TokenValues,
  getGlobalSetting,
  DialogService,
  HandleResponseService,
  systemMessage,
  validateInputsData,
  TokenValuesModel,
} from 'src/app/shared';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class RoutesComponent implements OnInit {
  @ViewChild('routeDetails') routeDetails!: Route;
  responsePaginationData: ResponsePaginationData | undefined;
  inputsLength: unknown | any;
  site: unknown | any;
  actionType: string = '';
  routesList: Route[] = [];
  busy = false;

  systemMessage: systemMessage = { ...site.systemMessage };
  tokenValues: TokenValues = { ...TokenValuesModel };

  route: Route = { ...RouteModel };

  permission: Permission = { ...PermissionModel };
  getGlobalSetting: any = undefined;

  constructor(
    private dialog: DialogService,
    private routeService: RoutesService,
    private handleResponse: HandleResponseService,
  ) {
    this.inputsLength = inputsLength;
    this.site = site;
  }

  displayAdd(templateRef: unknown) {
    this.dialog.showAdd(templateRef);
  }

  displayUpdate(templateRef: unknown) {
    this.dialog.showUpdate(templateRef);
  }

  displaySearch(templateRef: unknown) {
    this.dialog.showSearch(templateRef);
  }

  showDetails(templateRef: unknown) {
    this.dialog.showDetails(templateRef);
  }

  async getSetting() {
    this.getGlobalSetting = await getGlobalSetting();
  }

  async ngOnInit() {
    this.tokenValues = await getTokenValue();
    this.getSetting();
    this.getAllRouts();
  }

  async exportDataToExcel(table: string, file: string) {
    exportToExcel(table, file);
  }

  resetModel(action: string) {
    this.actionType = action;
    this.route = {
      name: '',
      ar: '',
      en: '',
      permissionsList: [],
      active: action === 'search' ? undefined : true,
    };
  }

  async setPermissionsList(list: Permission[]) {
    let permissionsList;
    if (list.length) {
      permissionsList = [];
      for await (const permission of list) {
        if (permission) {
          permissionsList.push({
            _id: permission?._id,
            name: permission?.name,
            ar: permission?.ar,
            en: permission?.en,
            active: permission?.active,
          });
        }
      }
      return permissionsList;
    } else {
      return (permissionsList = null);
    }
  }

  async addRoute(route: Route) {
    const permissionsList = await this.setPermissionsList(
      route.permissionsList,
    );
    const newRoute = {
      name: route.name,
      ar: route.ar,
      en: route.en,
      active: route.active,
      permissionsList,
    };
    this.busy = true;
    this.routeService.addRoute(newRoute).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.routesList.push({
        _id: Object(response.data)._id,
        name: route.name,
        ar: route.ar,
        en: route.en,
        active: route.active,
        permissionsList: Object(response.data).permissionsList,
        addInfo: Object(response.data).addInfo,
      });
      this.actionType = site.operation.getAll;
    });
  }

  searchRoute(route: Route, pagination = site.pagination) {
    this.routesList = [];
    this.busy = true;
    this.routeService.searchRoute({ query: route, ...pagination }).subscribe(async (res) => {
      this.responsePaginationData = res.paginationInfo;
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.routesList = response.data;
      this.actionType = site.operation.result;
    });
  }

  viewRoute(route: Route) {
    const query = {
      _id: route._id,
    };
    this.busy = true;
    this.routeService.viewRoute(query).subscribe(async (res: IResponse) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }

      this.route = {
        _id: response.data._id,
        name: response.data.name,
        ar: response.data.ar,
        en: response.data.en,
        permissionsList: response.data.permissionsList,
        active: response.data.active,
        addInfo: response.data.addInfo ? response.data.addInfo : undefined,
        lastUpdateInfo: response.data.lastUpdateInfo
          ? response.data.lastUpdateInfo
          : undefined,
      };
    });
  }

  async updateRoute(route: Route) {
    const permissionsList = await this.setPermissionsList(
      route.permissionsList,
    );
    const updateRoute = {
      _id: route._id,
      name: route.name,
      ar: route.ar,
      en: route.en,
      active: route.active,
      permissionsList,
    };
    this.busy = true;
    this.routeService
      .updateRoute(updateRoute)
      .subscribe(async (res: IResponse) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        for await (const item of this.routesList) {
          if (item._id === Object(response.data)._id) {
            site.spliceElementToUpdate(this.routesList, Object(response.data));
          }
        }
        this.actionType = site.operation.getAll;
      });
  }

  async getUserAction(event: number) {
    if (event) {
      this.deleteRoute(this.route, event);
    }
  }

  deleteRoute(route: Route, action?: number) {
    if (!action) {
      this.systemMessage = {
        show: true,
        titleClass: 'model-header-delete',
        title: 'Actions.Delete',
        message: validateInputsData.deleteRoute,
      };
      this.route = route;
      return;
    }
    const deletedRoute = {
      _id: route._id,
    };
    this.busy = true;
    this.routeService
      .deleteRoute(deletedRoute)
      .subscribe(async (res: IResponse) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        for await (const item of this.routesList) {
          if (String(item._id) === String(response.data._id)) {
            this.routesList.forEach((item: Route, index: number) => {
              if (item._id === response.data._id) {
                this.routesList.splice(index, 1);
              }
            });
          }
        }
      });

  }

  getAllRouts(pagination = site.pagination) {
    this.busy = true;
    this.routeService.getAllRouts(pagination).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.responsePaginationData = res.paginationInfo;
      this.routesList = response.data || [];
      this.actionType = site.operation.getAll;
    });
  }

  pushPermissionToPermissionsList(permission: Permission) {
    this.route.permissionsList.push({
      name: permission.name,
      ar: permission.ar,
      en: permission.en,
      active: permission.active,
    });
    this.resetPermission();
  }

  async removeUnitFromUnitsList(permission: Permission) {
    for (let i = 0; i < this.route.permissionsList.length; i++) {
      if (this.route.permissionsList[i] === permission) {
        this.route.permissionsList.splice(i, 1);
      }
    }
  }

  resetPermission() {
    this.permission = {
      name: '',
      ar: '',
      en: '',
      active: true,
    };
  }
  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllRouts();
  }
}
