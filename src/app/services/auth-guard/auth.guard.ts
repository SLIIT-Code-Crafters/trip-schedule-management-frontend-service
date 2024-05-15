import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot,} from '@angular/router';
import {LocalStorageService} from "../storage/local-storage.service";


export const CanActivateAuth: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {return true;
  const storageService = inject(LocalStorageService);
 
  return !!(storageService && storageService.getUserSession() && storageService.getUserSession()?.activatedUser);
};

export const CanActivateRegisterActive: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService = inject(LocalStorageService);
  return !!(storageService && storageService.getUserSession() && !storageService.getUserSession()?.activatedUser);
 
};


export const CanActivatePreLogin: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService = inject(LocalStorageService);
  if(state.url.includes('activation')){
    return !!(storageService.getUserSession() && storageService.getUserSession()?.email && !storageService.getUserSession()?.activatedUser);
  }else{
    storageService.clearSessionStorage();
  }
  return true;
};

