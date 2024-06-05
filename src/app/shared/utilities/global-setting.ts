import { site } from '..';


export async function getGlobalSetting() {
  let getSetting = localStorage.getItem(site.globalSetting);

  if (!getSetting) {
    return;
  }
  let setting;
  getSetting = await JSON.parse(getSetting);

  if (!getSetting) {
    return (setting = {});
  }

  setting = {
    displaySetting: {
      displayRecordDetails:
        Object(getSetting).displaySetting.displayRecordDetails,
      showTooltip: Object(getSetting).displaySetting.showTooltip,
      tooltipPosition: Object(getSetting).displaySetting.tooltipPosition,
    },
  };
  return { ...setting };
}
