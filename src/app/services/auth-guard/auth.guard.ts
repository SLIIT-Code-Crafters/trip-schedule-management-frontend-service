import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot,} from '@angular/router';
import {LocalStorageService} from "../storage/local-storage.service";
import {USER_ROLE_ADMINISTRATOR, USER_ROLE_ORGANIZER} from "../../utility/common/common-constant";


export const CanActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService = inject(LocalStorageService);
  const routerUrl = state.url;
  if(storageService && storageService.getUserSession() && storageService.getUserSession()?.activatedUser &&
    storageService.getUserSession()?.role){
    if(routerUrl.includes('organize')){
      return storageService.getUserSession()?.role == USER_ROLE_ORGANIZER || storageService.getUserSession()?.role == USER_ROLE_ADMINISTRATOR;
    }else if(routerUrl.includes('admin')){
      return storageService.getUserSession()?.role == USER_ROLE_ADMINISTRATOR;
    }else{
      return true;
    }
  }else {
    return false;
  }
};

export const CanActivateRegisterActive: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService = inject(LocalStorageService);
  return !!(storageService && storageService.getUserSession() && !storageService.getUserSession()?.activatedUser);
  //
  // return authService.checkLogin().pipe(
  //   map(() => true),
  //   catchError(() => {
  //     return router.createUrlTree(['route-to']);
  //   })
  // );
};


export const CanActivatePreLogin: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService = inject(LocalStorageService);
  console.log(state.url)
  if(state.url.includes('activation')){
    return !!(storageService.getUserSession() && storageService.getUserSession()?.email && !storageService.getUserSession()?.activatedUser);
  }else{
    storageService.clearSessionStorage();
  }
  return true;
};

