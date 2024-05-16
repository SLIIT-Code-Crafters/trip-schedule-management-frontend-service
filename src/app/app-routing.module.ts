import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {CanActivateAuth, CanActivatePreLogin} from "./services/auth-guard/auth.guard";
import {SigninPageComponent} from "./components/pre-login/signin-page/signin-page.component";
import {SignupComponent} from "./components/pre-login/signup/signup.component";
import {ActivationComponent} from "./components/pre-login/activation/activation.component";
import {EditProfileComponent} from "./components/post-login/edit-profile/edit-profile.component";
import {
  SysAdminTripCategoryComponent
} from "./components/post-login/admin/trip-category/sys-admin-trip-category/sys-admin-trip-category.component";
import {
  SysAdminSiteContentComponent
} from "./components/post-login/admin/site-content/sys-admin-site-content/sys-admin-site-content.component";
import {TripOrganizeComponent} from "./components/post-login/organizer/trip-organize/trip-organize.component";
import {CreateTripComponent} from "./components/post-login/organizer/create-trip/create-trip/create-trip.component";
import {CreateTripResolver} from "./resolver/resolvers";

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'pre-log',
    loadComponent: () => import('./components/pre-login/pre-login.component').then(t => t.PreLoginComponent),
    canActivate: [CanActivatePreLogin],
    children: [
      {
        path: '',
        component: SigninPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: SigninPageComponent,
        pathMatch: 'full'
      },
      {
        path: 'register',
        component: SignupComponent,
        pathMatch: 'full'
      },
      {
        path: 'activation',
        component: ActivationComponent,
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'post-log',
    loadComponent: () => import('./components/post-login/post-login.component').then(t => t.PostLoginComponent),
    canActivate: [CanActivateAuth],
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: EditProfileComponent,
        pathMatch: 'full'
      },
      {
        path: 'organize',
        children: [
          {
            path: '',
            component: TripOrganizeComponent,
          },
          {
            path: 'create-trip',
            resolve: {categoryList: CreateTripResolver},
            component: CreateTripComponent,
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/post-login/admin/admin.component').then(t => t.AdminComponent),
        children: [
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
      }
    ],
  },
  {
    path: '**',
    redirectTo: ''
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
