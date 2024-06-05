/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { City, CityModel, Gov } from 'src/app/interfaces';
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
  getGlobalSetting,
  DialogService,
  HandleResponseService,
  validateInputsData,
  systemMessage,
  TokenValuesModel,
  responsePaginationDataModel,
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
  @ViewChild('cityDetails') cityDetails!: City;
  responsePaginationData: ResponsePaginationData = {
    ...responsePaginationDataModel,
  };
  inputsLength: any;
  site: any;
  permissionsNames: any;
  actionType: string = '';
  govsList: Gov[] = [];
  citiesList: City[] = [];
  busy = false;
  systemMessage: systemMessage = { ...site.systemMessage };
  tokenValues: TokenValues = { ...TokenValuesModel };

  getGlobalSetting: any = undefined;
  city: City = { ...CityModel };

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

  showDialog(type: string, templateRef: unknown) {
    this.dialog.showDialog(type, templateRef);
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
      active: action === 'search' ? undefined : true,
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
        _id: Object(response.data)._id,
        gov: city.gov,
        name: city.name,
        active: city.active,
        addInfo: Object(response.data).addInfo,
      });
      this.dialog.close();
      this.actionType = site.operation.getAll;
    });
  }

  searchCity(city: City, pagination = site.pagination) {
    this.citiesList = [];
    this.busy = true;
    this.cityService
      .searchCity({ query: city, ...pagination })
      .subscribe(async (res) => {
        this.responsePaginationData = res.paginationInfo;
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        this.dialog.close();
        this.citiesList = response.data;
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
          if (item._id === Object(response.data)._id) {
            site.spliceElementToUpdate(this.citiesList, Object(response.data));
          }
        }
        this.dialog.close();
        this.actionType = site.operation.getAll;
      });
  }

  async getUserAction(event: number) {
    if (event) {
      this.deleteCity(this.city, event);
    }
  }

  deleteCity(city: City, action?: number) {
    if (!action) {
      this.systemMessage = {
        show: true,
        titleClass: 'model-header-delete',
        title: 'Actions.Delete',
        message: validateInputsData.deleteCity,
      };
      this.city = city;
      return;
    }
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
        if (String(item._id) === String(response.data._id)) {
          this.citiesList.forEach((item: any, index: number) => {
            if (item._id === response.data._id) {
              this.citiesList.splice(index, 1);
            }
          });
        }
      }
      this.dialog.close();
      this.responsePaginationData.totalDocs = --this.responsePaginationData
        .totalDocs;
    });
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
        (city) => city && city._id === response.data._id,
      );
      selectedCityIndex >= 0
        ? (this.citiesList[selectedCityIndex] = response.data)
        : response.data;

      const selectedGovIndex = this.govsList.findIndex(
        (gov) => gov && gov._id === response.data.gov._id,
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
    });
  }

  getAllCities(pagination = site.pagination) {
    this.busy = true;
    this.cityService.getAllCities(pagination).subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      this.busy = false;
      if (!response.success) {
        return;
      }
      this.responsePaginationData = res.paginationInfo;
      this.citiesList = response.data || [];
      this.actionType = site.operation.getAll;
    });
  }

  getActiveGovs() {
    this.govService.getActiveGovs().subscribe(async (res) => {
      const response = await this.handleResponse.checkResponse(res);
      if (!response.success) {
        return;
      }
      this.govsList = response.data || [];
    });
  }

  resetActionTypeToClose() {
    this.actionType = site.operation.close;
    this.getAllCities();
  }
}
