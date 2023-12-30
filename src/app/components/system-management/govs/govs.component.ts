/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Gov } from 'src/app/interfaces';
import {
  DialogService,
  GovsService,
  NotificationService,
} from 'src/app/services';

import {
  IResponse,
  site,
  permissionsNames,
  exportToExcel,
  getTokenValue,
  inputsLength,
  validateResponse,
  ResponsePaginationData,
  TokenValues,
  Pagination,
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
  responsePaginationData: ResponsePaginationData | undefined;
  inputsLength: unknown | any;
  site: unknown | any;
  permissionsNames: unknown | any;
  actionType: string = '';
  govsList: Gov[] = [];
  busy = false;
  lang: string = '';

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
    private govService: GovsService,
    private notification: NotificationService,
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

    this.getAllGovs();
  }

  async exportDataToExcel(table: string, file: string) {
    exportToExcel(table, file);
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
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
         return this.notification.info(response.message);
      }
      this.notification.success(response.message);
      this.govsList.push({
        _id: Object(res.data)._id,
        name: gov.name,
        code: gov.code,
        active: gov.active,
      });
      this.actionType = site.operation.result;

      this.busy = false;
    });
  }

  async updateGov(gov: Gov) {
    this.busy = true;
    this.govService.updateGov(gov).subscribe(async (res: IResponse) => {
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
         return this.notification.info(response.message);
      }
      this.notification.success(response.message);
      for await (const item of this.govsList) {
        if (item._id === Object(res.data)._id) {
          site.spliceElementToUpdate(this.govsList, Object(res.data));
        }
      }
      this.actionType = site.operation.result;
      this.busy = false;
    });
  }

  deleteGov(gov: Gov) {
    let confirmMessage;
    if (!this.lang || this.lang === site.language.en) {
      confirmMessage = site.confirmMessage.en;
    }
    if (this.lang === site.language.ar) {
      confirmMessage = site.confirmMessage.ar;
    }
    const confirmDelete = confirm(confirmMessage);
    if (confirmDelete) {
      const deletedGov = {
        _id: gov._id,
      };
      this.busy = true;
      this.govService.deleteGov(deletedGov).subscribe(async (res) => {
        const response = await validateResponse(res);

        if (!response.success || !response.data) {
           return this.notification.info(response.message);
        }
        this.notification.warning(response.message);
        for await (const item of this.govsList) {
          if (String(item._id) === String(res.data._id)) {
            this.govsList.forEach((item: Gov, index: number) => {
              if (item._id === res.data._id) {
                this.govsList.splice(index, 1);
              }
            });
          }
        }
        this.busy = false;
      });
    }
  }

  searchGov(gov: Gov, pagination?: Pagination) {
    const searchData = {
      query: gov,
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };
    this.busy = true;
    this.govService.searchGov(searchData).subscribe(async (res) => {
      this.responsePaginationData = res.paginationInfo;
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
         return this.notification.info(response.message);
      }
      this.notification.success(response.message);
      this.govsList = res.data;
      this.actionType = site.operation.result;

      this.busy = false;
    });
  }

  setData(gov: Gov) {
    this.gov = {
      _id: gov._id,
      name: gov.name,
      code: gov.code,
      active: gov.active,
    };
  }

  getAllGovs(pagination?: Pagination) {
    const paginationData = {
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };
    this.busy = true;
    this.govService.getAllGovs(paginationData).subscribe(async (res) => {
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
         return this.notification.info(response.message);
      }
      this.notification.success(response.message);
      this.responsePaginationData = res.paginationInfo;
      this.govsList = res.data || [];
      this.actionType = site.operation.getAll;
      this.busy = false;
    });
  }

  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllGovs();
  }
}
