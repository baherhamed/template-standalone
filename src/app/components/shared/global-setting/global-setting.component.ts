import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  HandleResponseService,
  IResponse,
  SharedService,
  TokenValues,
  TokenValuesModel,
  getTokenValue,
} from 'src/app/shared';
import { DisplaySettingModel, GlobalSetting, IJson } from 'src/app/interfaces';

@Component({
  selector: 'global-setting',
  templateUrl: './global-setting.component.html',
  styleUrl: './global-setting.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class GlobalSettingComponent implements OnInit {

  lang: string = '';

  tokenValues: TokenValues = { ...TokenValuesModel };

  globalSetting: GlobalSetting = { ...DisplaySettingModel };

  busy = false;
  tooltipPositionList: IJson[] = [];
  constructor(
    private sharedService: SharedService,
    private handleResponse: HandleResponseService,
  ) { }

  async ngOnInit() {
    this.tokenValues = await getTokenValue();
    this.lang = this.tokenValues.language;
    this.getTooltipPosition();
    this.getGlobalSystemSetting();
  }

  async getGlobalSystemSetting() {
    this.busy = true;
    this.sharedService
      .getGlobalSystemSetting()
      .subscribe(async (res: IResponse) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        let selectToolTipPosionIndex = this.tooltipPositionList.findIndex(
          (p) => p && p.id === response.data.displaySetting.tooltipPosition.id,
        );

        this.globalSetting = response.data?._id ? response.data : this.globalSetting;
        this.globalSetting.displaySetting.tooltipPosition =
          this.tooltipPositionList[selectToolTipPosionIndex]
          || response.data.displaySetting.tooltipPosition;
      });
  }

  async setGlobalSystemSetting(globalSystemSetting: GlobalSetting) {
    this.busy = true;
    this.sharedService
      .setGlobalSystemSetting(globalSystemSetting)
      .subscribe(async (res) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }

        this.globalSetting = response.data;
        this.globalSetting.displaySetting.tooltipPosition =
          globalSystemSetting.displaySetting.tooltipPosition;
      });
  }

  async getTooltipPosition() {
    this.busy = true;
    this.sharedService
      .getTooltipPosition()
      .subscribe(async (res: IResponse) => {
        const response = await this.handleResponse.checkResponse(res);
        this.busy = false;
        if (!response.success) {
          return;
        }
        this.tooltipPositionList = response.data;
      });
  }
}
