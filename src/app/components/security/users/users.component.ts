/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Permission, Route, User, UserModel } from 'src/app/interfaces';
import { RoutesService, UsersService } from 'src/app/services';
import { DefinitionsService } from 'src/app/shared/services/definitions.service';

import {
  getTokenValue,
  inputsLength,
  Language,
  site,
  exportToExcel,
  permissionsNames,
  ResponsePaginationData,
  TokenValues,
  getGlobalSetting,
  IResponse,
  DialogService,
  HandleResponseService,
  systemMessage,
  validateInputsData,
  TokenValuesModel,
  responsePaginationDataModel,
} from 'src/app/shared';

import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class UsersComponent implements OnInit {
  @ViewChild('userDetails') userDetails!: User;
  responsePaginationData: ResponsePaginationData = { ...responsePaginationDataModel };
  inputLength: any;
  site: any;
  permissionsNames: any;
  actionType: string = '';
  languagesList: Language[] = [];
  usersList: User[] = [];
  routesList: Route[] = [];
  permissionsList: Permission[] = [];
  busy = false;

  user: User = { ...UserModel };

  getGlobalSetting: any = undefined;

  systemMessage: systemMessage = { ...site.systemMessage };
  tokenValues: TokenValues = { ...TokenValuesModel };

  constructor(
    private dialog: DialogService,
    private handleResponse: HandleResponseService,
    private userService: UsersService,
    private routeService: RoutesService,
    private definitionService: DefinitionsService,
  ) {
    this.inputLength = inputsLength;
    this.site = site;
    this.permissionsNames = permissionsNames;
  }


  showDialog(type: string, templateRef: unknown) {
    this.dialog.showDialog(type, templateRef);
  }


  async getSetting() {
    this.getGlobalSetting = await getGlobalSetting();
  }

  async ngOnInit() {
    this.tokenValues = await getTokenValue();

    this.getSetting();
    this.getActiveLanguages();
    this.getActiveRoutes();
    this.getAllUsers();
  }

  async exportDataToExcel(table: any, file: any) {
    exportToExcel(table, file);
  }

  resetModel(action: string) {
    this.usersList = [];
    this.actionType = action;
    this.user = {
      name: '',
      mobile: '',
      email: '',
      password: '',
      language: {
        _id: '',
        name: '',
      },
      routesList: this.routesList,
      permissionsList: [],
      active: action === 'search' ? undefined : true,
    };
    this.getActiveRoutes();
  }

  async addUser(user: User) {
    const routesList = await this.setRoleRoutesList();
    const permissionsList = await this.setPermissionsList();

    const newUser = {
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      routesList,
      permissionsList,
      password: user.password,
      languageId: user.language._id,
      active: user.active,
    };
    this.busy = true;
    this.userService.addUser(newUser).subscribe(async (res: any) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.actionType = '';
      this.usersList.push({
        _id: Object(response.data)._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        password: user.password,
        language: user.language,
        routesList: user.routesList,
        permissionsList: user.permissionsList,
        active: user.active,
        addInfo: Object(response.data).addInfo,
      });
      this.actionType = site.operation.getAll;
    });
  }

  searchUser(user: User, pagination = site.pagination) {
    this.usersList = [];
    this.busy = true;
    this.userService.searchUser({ query: user, ...pagination }).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.responsePaginationData = response.paginationInfo;
      this.usersList = response.data;
      this.actionType = site.operation.result;
      this.busy = false;
    });
  }

  async updateUser(user: User) {
    const routesList = await this.setRoleRoutesList();
    const permissionsList = await this.setPermissionsList();
    this.busy = true;
    const updatedUser = {
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      password: user.password,
      languageId: user.language._id,
      routesList,
      permissionsList,
      active: user.active,
    };

    this.userService.updateUser(updatedUser).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      for await (const item of this.usersList) {
        if (item._id === response.data._id) {
          site.spliceElementToUpdate(this.usersList, response.data);
        }
      }
      this.actionType = site.operation.getAll;
    });
  }

  async getUserAction(event: number) {
    if (event) {
      this.deleteUser(this.user, event);
    }
  }

  deleteUser(user: User, action?: number) {
    if (!action) {
      this.systemMessage = {
        show: true,
        titleClass: 'model-header-delete',
        title: 'Actions.Delete',
        message: validateInputsData.deleteUser,
      };
      this.user = user;
      return;
    }

    const deletedRuser = {
      _id: user._id,
    };

    this.busy = true;
    this.userService.deleteUser(deletedRuser).subscribe(async (res: any) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      for await (const item of this.usersList) {
        if (String(item._id) === String(response.data._id)) {
          this.usersList.forEach((item: any, index: number) => {
            if (item._id === response.data._id) {
              this.usersList.splice(index, 1);
            }
          });
        }
      }
      this.responsePaginationData.totalDocs = --this.responsePaginationData.totalDocs;
    });
  }

  viewUser(user: User) {
    const query = {
      _id: user._id,
    };
    this.busy = true;
    this.userService.viewUser(query).subscribe(async (res: IResponse) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      for await (const lang of this.languagesList) {
        if (lang._id === Object(response.data.language)._id) {
          site.spliceElementToUpdate(this.languagesList, Object(response.data));
        }
      }
      this.user = {
        _id: response.data._id,
        name: response.data.name,
        mobile: response.data.mobile,
        email: response.data.email,
        language: response.data.language,
        routesList: response.data.routesList,
        active: response.data.active,
        addInfo: response.data.addInfo ? response.data.addInfo : undefined,
        lastUpdateInfo: response.data.lastUpdateInfo
          ? response.data.lastUpdateInfo
          : undefined,
      };
    });
  }

  async setRoleRoutesList() {
    const selectedRoutesList = [];
    for await (const route of this.user.routesList) {
      if (route && route.active) {
        selectedRoutesList.push(route.name);
      }
    }
    return selectedRoutesList;
  }

  async setPermissionsList() {
    const selectedPermissionsList = [];
    for await (const route of this.user.routesList) {
      if (route && route.active) {
        for await (const permission of route.permissionsList) {
          if (permission && permission.active) {
            selectedPermissionsList.push(permission.name);
          }
        }
      }
    }

    return selectedPermissionsList;
  }

  getActiveLanguages() {
    this.definitionService.getActiveLanguages().subscribe(async (res) => {
      this.languagesList = res.data;
    });
  }

  getActiveRoutes() {
    this.routesList = [];
    this.routeService.getActiveRoutes().subscribe(async (res) => {
      this.routesList = res.data;
    });
  }

  getAllUsers(pagination = site.pagination) {

    this.busy = true;
    this.userService.getAllUsers(pagination).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.responsePaginationData = res.paginationInfo;
      this.usersList = response.data || [];
      this.actionType = site.operation.getAll;
    });
  }

  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllUsers();
  }
}
