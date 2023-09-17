
import {

  Routes,
} from '@angular/router';
import { SecuritRoutes, SystemManagementRoutes } from './configs';
import { AuthGuard } from './services';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/',
  },
  {
    path: SecuritRoutes.login.name,
    loadComponent: () =>
      import('./components/security/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: SecuritRoutes.users.name,
    loadComponent: () =>
      import('./components/security/users/users.component').then(
        (c) => c.UsersComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: SecuritRoutes.routes.name,
    loadComponent: () =>
      import('./components/security/routes/routes.component').then(
        (c) => c.RoutesComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: SystemManagementRoutes.govs.name,
    loadComponent: () =>
      import('./components/system-management/govs/govs.component').then(
        (c) => c.GovsComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: SystemManagementRoutes.cities.name,
    loadComponent: () =>
      import('./components/system-management/cities/cities.component').then(
        (c) => c.CitiesComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
