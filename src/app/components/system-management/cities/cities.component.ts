/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { City, Gov } from 'src/app/interfaces';
import { CitiesService, GovsService } from 'src/app/services';

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
  getGlobalSetting: any = undefined;

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
    private handleResponse: HandleResponseService,
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
    this.getSetting();
    this.getActiveGovs();
    this.getAllCities();
  }

  async exportDataToExcel(table: any, file: any) {
    exportToExcel(table, file);
  }

  async getSetting() {
    this.getGlobalSetting = await getGlobalSetting();
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
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.citiesList.push({
        _id: Object(res.data)._id,
        gov: city.gov,
        name: city.name,
        active: city.active,
        addInfo: Object(res.data).addInfo,
      });
      this.actionType = site.operation.result;
    });
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
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.citiesList = res.data;
      this.actionType = site.operation.result;
    });
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
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        for await (const item of this.citiesList) {
          if (item._id === Object(res.data)._id) {
            site.spliceElementToUpdate(this.citiesList, Object(res.data));
          }
        }
        this.actionType = site.operation.result;
      });
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
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        for await (const item of this.citiesList) {
          if (String(item._id) === String(res.data._id)) {
            this.citiesList.forEach((item: any, index: number) => {
              if (item._id === res.data._id) {
                this.citiesList.splice(index, 1);
              }
            });
          }
        }
      });
    }
  }

  viewCity(city: City) {
    const query = {
      _id: city._id,
    };
    this.busy = true;
    this.cityService.viewCity(query).subscribe(async (res: IResponse) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      const selectedCityIndex = this.citiesList.findIndex(
        (city) => city && city._id === res.data._id,
      );
      selectedCityIndex >= 0
        ? (this.citiesList[selectedCityIndex] = res.data)
        : res.data;

      const selectedGovIndex = this.govsList.findIndex(
        (gov) => gov && gov._id === res.data.gov._id,
      );

      this.city = {
        _id: response.data._id,
        name: response.data.name,
        gov:
          selectedGovIndex >= 0
            ? this.govsList[selectedGovIndex]
            : response.data.gov,
        active: response.data.active,
        addInfo: response.data.addInfo ? response.data.addInfo : undefined,
        lastUpdateInfo: response.data.lastUpdateInfo
          ? response.data.lastUpdateInfo
          : undefined,
      };
      this.busy = false;
    });
  }

  getAllCities(pagination?: any) {
    const paginationData = {
      page: pagination?.pageIndex,
      limit: pagination?.pageSize,
    };
    this.busy = true;
    this.cityService.getAllCities(paginationData).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.responsePaginationData = res.paginationInfo;
      this.citiesList = res.data || [];
      this.actionType = site.operation.getAll;
    });
  }

  getActiveGovs() {
    this.govService.getActiveGovs().subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.govsList = res.data || [];
    });
  }
  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllCities();
  }
}
