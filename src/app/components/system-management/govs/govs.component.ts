/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Gov } from 'src/app/interfaces';
import { GovsService } from 'src/app/services';

import {
  IResponse,
  site,
  permissionsNames,
  exportToExcel,
  getTokenValue,
  inputsLength,
  ResponsePaginationData,
  TokenValues,
  Pagination,
  getGlobalSetting,
  DialogService,
  HandleResponseService,
  systemMessage,
  ValidateInputsData,
} from 'src/app/shared';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'govs',
  templateUrl: './govs.component.html',
  styleUrls: ['./govs.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class GovsComponent implements OnInit {
  @ViewChild('govDetails') govDetails!: Gov;
  responsePaginationData: ResponsePaginationData | undefined;
  inputsLength: unknown | any;
  site: unknown | any;
  permissionsNames: unknown | any;
  actionType: string = '';
  govsList: Gov[] = [];
  busy = false;

  systemMessage: systemMessage = {
    show: false,
    titleClass: '',
    title: '',
    message: { ar: '', en: '' },
    action: 0
  };
  lang: string = '';
  getGlobalSetting: any = undefined;

  gov: Gov = {
    name: '',
    code: '',
    active: true,
  };

  tokenValues: TokenValues = {
    userId: '',
    name: '',
    language: '',
    routesList: [],
    permissionsList: [],
    isDeveloper: false,
    userLoggedIn: false,
  };

  constructor(
    private dialog: DialogService,
    private handleResponse: HandleResponseService,
    private govService: GovsService,
  ) {
    this.inputsLength = inputsLength;
    this.site = site;
    this.permissionsNames = permissionsNames;
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

  async ngOnInit() {
    this.tokenValues = await getTokenValue();
    this.getSetting();
    this.getAllGovs();
  }

  async exportDataToExcel(table: string, file: string) {
    exportToExcel(table, file);
  }

  async getSetting() {
    this.getGlobalSetting = await getGlobalSetting();
  }

  resetModel(action: string) {
    this.actionType = action;
    this.gov = {
      name: '',
      code: '',
      active: true,
    };
  }

  async addGov(gov: Gov) {
    this.busy = true;
    this.govService.addGov(gov).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.govsList.push({
        _id: Object(response.data)._id,
        name: gov.name,
        code: gov.code,
        active: gov.active,
        addInfo: Object(response.data).addInfo,
      });
      this.actionType = site.operation.result;
    });
  }

  async updateGov(gov: Gov) {
    this.busy = true;
    this.govService.updateGov(gov).subscribe(async (res: IResponse) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }

      for await (const item of this.govsList) {
        if (item._id === Object(response.data)._id) {
          site.spliceElementToUpdate(this.govsList, response.data);
        }
      }
      this.actionType = site.operation.result;
    });
  }

  getUserAction(event: any) {
    console.log('evenet', event);
    // this.systemMessage.action = event;
    this.systemMessage = {
      show: false,
      title: '',
      titleClass: '',
      message: { ar: '', en: '' },
      action: event
    }

  }

  deleteGov(gov: Gov) {
    console.log('this.systemMessage', this.systemMessage);

    this.systemMessage = {
      show: true,
      titleClass: 'model-header-delete',
      title: 'Actions.Delete',
      message: ValidateInputsData.deleteGov,
      action: this.systemMessage.action
    };
    const action = this.systemMessage.action;
    console.log('action', action);
    if (!action) {
      return
    }
    console.log('passed');

    const deletedGov = {
      _id: gov._id,
    };
    this.busy = true;
    this.govService.deleteGov(deletedGov).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      for await (const item of this.govsList) {
        if (
          response?.data &&
          String(item._id) === String(response?.data._id)
        ) {
          this.govsList.forEach((item: Gov, index: number) => {
            if (item._id === response.data._id) {
              this.govsList.splice(index, 1);
            }
          });
        }
      }
    });

  }

  searchGov(gov: Gov, pagination?: Pagination) {
    this.govsList = [];
    const searchData = {
      query: gov,
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };
    this.busy = true;
    this.govService.searchGov(searchData).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.responsePaginationData = response?.paginationInfo;
      this.govsList = response.data;
      this.actionType = site.operation.result;

    });
  }

  async viewGov(gov: Gov) {
    const query = {
      _id: gov._id,
    };
    this.busy = true;
    this.govService.viewGov(query).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }

      for await (const item of this.govsList) {
        if (item._id === Object(response.data)._id) {
          site.spliceElementToUpdate(this.govsList, Object(response.data));
        }
      }
      this.gov = {
        _id: response.data._id,
        name: response.data.name,
        code: response.data.code,
        active: response.data.active,
        addInfo: response.data.addInfo ? response.data.addInfo : undefined,
        lastUpdateInfo: response.data.lastUpdateInfo
          ? response.data.lastUpdateInfo
          : undefined,
      };

    });
  }

  async getAllGovs(pagination?: Pagination) {
    this.busy = true;

    const paginationData = {
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };

    this.govService.getAllGovs(paginationData).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }

      this.actionType = site.operation.getAll;
      this.responsePaginationData = response.paginationInfo;
      this.govsList = response.data || [];

    });
  }

  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllGovs();
  }
}
