import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SigninPageComponent } from './components/signin-page/signin-page.component';
import { SignupComponent } from './components/signup/signup.component';

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

  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
