import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SigninPageComponent } from './components/signin-page/signin-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import {
  SysAdminTripCategoryComponent
} from "./components/admin/trip-category/sys-admin-trip-category/sys-admin-trip-category.component";
import {
  SysAdminSiteContentComponent
} from "./components/admin/site-content/sys-admin-site-content/sys-admin-site-content.component";
import { ActivationComponent } from './components/activation/activation.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'login',
    component: SigninPageComponent,
  },
  {
    path: 'register',
    component: SignupComponent,
  },
  {
    path: 'profile',
    component: EditProfileComponent,
  },
  {
    path: 'activation',
    component: ActivationComponent,
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(t=>t.AdminComponent),
    children:[
      {
        path: '',
        component: SysAdminTripCategoryComponent,
      },
      {
        path: 'sysadmin-category',
        component: SysAdminTripCategoryComponent,
        pathMatch: 'full',
      },
      {
        path: 'site-content',
        component: SysAdminSiteContentComponent,
        pathMatch: 'full',
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
