import { Component, OnInit } from '@angular/core';

import { NotificationService, SharedService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { IResponse, validateResponse } from 'src/app/shared';
import { GlobalSetting } from 'src/app/interfaces';

@Component({
  selector: 'global-setting',
  templateUrl: './global-setting.component.html',
  styleUrl: './global-setting.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class GlobalSettingComponent implements OnInit {
  globalSetting: GlobalSetting = {
    displaySetting: {
      displayRecordDetails: false,
      showTooltip: false,
    },
  };
  busy = false;

  constructor(
    private sharedService: SharedService,
    private notification: NotificationService,
  ) {}

  ngOnInit() {
    this.getGeneralSystemSetting();
  }

  async getGeneralSystemSetting() {
    this.busy = true;
    this.sharedService
      .getGeneralSystemSetting()
      .subscribe(async (res: IResponse) => {
        const response = await validateResponse(res);
        if (!response.success || !response.data) {
          return this.notification.info(response.message);
        }

        // this.notification.success(response.message);
        this.globalSetting = res.data?._id
          ? res.data
          : this.globalSetting;
        this.busy = false;
      });
  }

  async setGeneralSystemSetting(generalSystemSetting: GlobalSetting) {
    this.busy = true;
    this.sharedService
      .setGeneralSystemSetting(generalSystemSetting)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe(async (res) => {
        const response = await validateResponse(res);
        if (!response.success || !response.data) {
          return this.notification.info(response.message);
        }
        this.notification.success(response.message);
        this.globalSetting = res.data;
        this.busy = false;
      });
  }
}
