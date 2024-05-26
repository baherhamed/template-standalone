import { Injectable, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { appsNames, site } from '..';


@Injectable({
  providedIn: 'root',
})
export class SetAppNameService implements OnInit {
  constructor(public title: Title) {}

  ngOnInit(): void {
    this.setAppName();
  }

  setAppName = async (screen?: string) => {
    const selectedScreen =
      screen?.split('/')[3] || screen?.split('/')[4] || screen;
    const currentLang = localStorage.getItem(site.currentLangValue);
    let selectedApp = appsNames.findIndex(
      (co) => co.app?.toLowerCase() === selectedScreen?.toLowerCase(),
    );

    if (selectedApp === -1) {
      selectedApp = appsNames.findIndex(
        (el) => el.app.toLowerCase() === 'home',
      );
    }

    let data;
    if (!currentLang || currentLang === site.language.ar) {
      this.title.setTitle(String(appsNames[selectedApp]?.ar));
      data = String(appsNames[selectedApp]?.ar);
    } else if (currentLang === site.language.en) {
      this.title.setTitle(String(appsNames[selectedApp]?.en));
      data = String(appsNames[selectedApp]?.en);
    }

    return data;
  };
}
