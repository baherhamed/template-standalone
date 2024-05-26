import { IJson } from './json';

export interface GlobalSetting {
  _id?: string;
  displaySetting: {
    displayRecordDetails: boolean;
    showTooltip: boolean;
    tooltipPosition: IJson;
  };
}
