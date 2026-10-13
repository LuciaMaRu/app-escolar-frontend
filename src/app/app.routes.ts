import { Routes } from '@angular/router';
import path from 'path';
import { LoginScreen } from './screens/login-screen/login-screen';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./screens/login-screen/login-screen').then(m => m.LoginScreen)
  },

];
