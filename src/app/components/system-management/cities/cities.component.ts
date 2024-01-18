/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { City, Gov } from 'src/app/interfaces';
import {
  CitiesService,
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
  selector: 'cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class CitiesComponent {
  responsePaginationData: ResponsePaginationData | undefined;
  inputsLength: any;
  site: any;
  permissionsNames: any;
  actionType: string = '';
  govsList: Gov[] = [];
  citiesList: City[] = [];
  busy = false;
  lang: string = '';

  city: City = {
    gov: {
      _id: '',
      name: '',
    },
    name: '',
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
    private cityService: CitiesService,
    private notification: NotificationService,
  ) {
    this.inputsLength = inputsLength;
    this.site = site;
    this.permissionsNames = permissionsNames;
  }

  displayAdd(templateRef: any) {
    this.dialog.showAdd(templateRef);
  }

  displayUpdate(templateRef: any) {
    this.dialog.showUpdate(templateRef);
  }

  displaySearch(templateRef: any) {
    this.dialog.showSearch(templateRef);
  }

  showDetails(templateRef: any) {
    this.dialog.showDetails(templateRef);
  }

  async ngOnInit() {
    this.tokenValues = await getTokenValue();

    this.getActiveGovs();
    this.getAllCities();
  }

  async exportDataToExcel(table: any, file: any) {
    exportToExcel(table, file);
  }

  resetModel(action: string) {
    this.actionType = action;
    this.city = {
      gov: {
        _id: '',
        name: '',
      },
      name: '',
      active: true,
    };
  }

  async addCity(city: City) {
    const newCity = {
      govId: city.gov._id,
      name: city.name,
      active: city.active,
    };
    this.busy = true;
    this.cityService.addCity(newCity).subscribe(async (res) => {
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
        return this.notification.info(response.message);
      }

      this.citiesList.push({
        _id: Object(res.data)._id,
        gov: city.gov,
        name: city.name,
        active: city.active,
      });
    });
    this.actionType = site.operation.result;

    this.busy = false;
  }

  searchCity(city: City, pagination?: Pagination) {
    this.citiesList = [];
    const searchData = {
      query: city,
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };
    this.busy = true;
    this.cityService.searchCity(searchData).subscribe(async (res) => {
      this.responsePaginationData = res.paginationInfo;
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
        return this.notification.info(response.message);
      }
      this.notification.success(response.message);
      this.citiesList = res.data;
    });
    this.actionType = site.operation.result;
    this.busy = false;
  }

  async setData(city: City) {
    let selectedGov;

    for await (const gov of this.govsList) {
      if (gov && gov._id === city.gov._id) {
        selectedGov = gov;
      }
    }

    this.city = {
      _id: city._id,
      gov: selectedGov || city.gov,
      name: city.name,
      active: city.active,
    };
  }

  async updateCity(city: City) {
    const updatedCity = {
      _id: city._id,
      govId: city.gov._id,
      name: city.name,
      active: city.active,
    };
    this.busy = true;
    this.cityService
      .updateCity(updatedCity)
      .subscribe(async (res: IResponse) => {
        const response = await validateResponse(res);
        if (!response.success || !response.data) {
          return this.notification.info(response.message);
        }
        this.notification.success(response.message);
        for await (const item of this.citiesList) {
          if (item._id === Object(res.data)._id) {
            site.spliceElementToUpdate(this.citiesList, Object(res.data));
          }
        }
      });
    this.actionType = site.operation.result;
    this.busy = false;
  }

  deleteCity(city: City) {
    let confirmMessage;
    if (!this.lang || this.lang === site.language.en) {
      confirmMessage = site.confirmMessage.en;
    }
    if (this.lang === site.language.ar) {
      confirmMessage = site.confirmMessage.ar;
    }
    const confirmDelete = confirm(confirmMessage);
    if (confirmDelete) {
      const deletedCity = {
        _id: city._id,
      };
      this.busy = true;
      this.cityService.deleteCity(deletedCity).subscribe(async (res) => {
        const response = await validateResponse(res);

        if (!response.success || !response.data) {
          return this.notification.info(response.message);
        }
        this.notification.warning(response.message);
        for await (const item of this.citiesList) {
          if (String(item._id) === String(res.data._id)) {
            this.citiesList.forEach((item: any, index: number) => {
              if (item._id === res.data._id) {
                this.citiesList.splice(index, 1);
              }
            });
          }
        }

        this.busy = false;
      });
    }
  }

  getAllCities(pagination?: any) {
    const paginationData = {
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };
    this.busy = true;
    this.cityService.getAllCities(paginationData).subscribe(async (res) => {
      const response = await validateResponse(res);
      if (!response.success || !response.data) {
        return this.notification.info(response.message);
      }
      this.notification.success(response.message);
      this.responsePaginationData = res.paginationInfo;
      this.citiesList = res.data || [];
    });
    this.actionType = site.operation.getAll;
    this.busy = false;
  }

  getActiveGovs() {
    this.govService.getActiveGovs().subscribe(async (res) => {
      this.govsList = res.data || [];
    });
  }
  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllCities();
  }
}
