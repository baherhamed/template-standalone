import { Routes } from '@angular/router';
import { SecuritRoutes, SystemManagementRoutes } from './configs';
import { AuthGuard } from './services';

export const routes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
    // redirectTo: '/',
  //   canActivate: [AuthGuard]
  // },
  {
    path: SecuritRoutes.login.name,
    loadComponent: async () =>
      (await import('./components/security/login/login.component'))
        .LoginComponent,
  },
  {
    path: SecuritRoutes.users.name,
    loadComponent: async () =>
      (await import('./components/security/users/users.component'))
        .UsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: SecuritRoutes.routes.name,
    loadComponent: async () =>
      (await import('./components/security/routes/routes.component'))
        .RoutesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: SystemManagementRoutes.govs.name,
    loadComponent: async () =>
      (await import('./components/system-management/govs/govs.component'))
        .GovsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: SystemManagementRoutes.cities.name,
    loadComponent: async () =>
      (await import('./components/system-management/cities/cities.component'))
        .CitiesComponent,
        
    canActivate: [AuthGuard],
  },
  {
    path: 'globalSetting',
    loadComponent: async () =>
      (await import('./components/shared/global-setting/global-setting.component'))
        .GlobalSettingComponent,
        
    canActivate: [AuthGuard],
  },
  // {
  //   path: '**',
  //   redirectTo: '/',
  // },
];
