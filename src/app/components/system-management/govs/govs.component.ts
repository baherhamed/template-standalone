/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Gov, GovModel } from 'src/app/interfaces';
import { GovsService } from 'src/app/services';

import {
  IResponse,
  site,
  permissionsNames,
  exportToExcel,
  getTokenValue,
  inputsLength,
  TokenValues,
  getGlobalSetting,
  DialogService,
  HandleResponseService,
  systemMessage,
  validateInputsData,
  ResponsePaginationData,
  TokenValuesModel,
  responsePaginationDataModel,
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
  responsePaginationData: ResponsePaginationData = {
    ...responsePaginationDataModel,
  };
  inputsLength: any;
  site: any;
  permissionsNames: any;
  actionType: string = '';
  govsList: Gov[] = [];
  actionCode: any = 0;
  busy = false;
  showMessage = false;

  systemMessage: systemMessage = { ...site.systemMessage };
  tokenValues: TokenValues = { ...TokenValuesModel };
  getGlobalSetting: any = undefined;
  gov: Gov = { ...GovModel };

  constructor(
    private dialog: DialogService,
    private handleResponse: HandleResponseService,
    private govService: GovsService,
    private meta: Meta,
  ) {
    this.inputsLength = inputsLength;
    this.site = site;
    this.permissionsNames = permissionsNames;
  }

  async ngOnInit() {
    this.tokenValues = await getTokenValue();
    this.getSetting();
    this.getAllGovs();
    this.meta.updateTag({name: "description", content: "Gov Component"});
  }

  showDialog(type: string, templateRef: unknown) {
    this.dialog.showDialog(type, templateRef);
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
      active: action === 'search' ? undefined : true,
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
      this.dialog.close();
      this.actionType = site.operation.getAll;
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
      this.dialog.close();
      this.actionType = site.operation.getAll;
    });
  }

  async getUserAction(event: number) {
    if (event) {
      this.deleteGov(this.gov, event);
    }
  }

  async deleteGov(gov: Gov, action?: number) {
    if (!action) {
      this.systemMessage = {
        show: true,
        titleClass: 'model-header-delete',
        title: 'Actions.Delete',
        message: validateInputsData.deleteGov,
      };
      this.gov = gov;
      return;
    }

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
        if (response?.data && String(item._id) === String(response?.data._id)) {
          this.govsList.forEach((item: Gov, index: number) => {
            if (item._id === response.data._id) {
              this.govsList.splice(index, 1);
            }
          });
        }
      }
      this.dialog.close();
      this.responsePaginationData.totalDocs = --this.responsePaginationData
        .totalDocs;
    });
  }

  searchGov(gov: Gov, pagination = site.pagination) {
    this.govsList = [];
    this.busy = true;
    this.govService
      .searchGov({ query: gov, ...pagination })
      .subscribe(async (res) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        this.responsePaginationData = response?.paginationInfo;
        this.govsList = response.data;
        this.dialog.close();
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

  async getAllGovs(pagination = site.pagination) {
    this.busy = true;

    this.govService.getAllGovs(pagination).subscribe(async (res) => {
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
