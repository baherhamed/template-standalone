import { IJson } from './json';

export interface GlobalSetting {
  _id?: string;
  displaySetting: {
    displayRecordDetails: boolean;
    showTooltip: boolean;
    tooltipPosition: IJson;
  };
}
export const DisplaySettingModel = {
  displaySetting: {
    displayRecordDetails: false,
    showTooltip: false,
    tooltipPosition: {
      id: 0,
      name: '',
      ar: '',
      en: '',
    },
  },
};