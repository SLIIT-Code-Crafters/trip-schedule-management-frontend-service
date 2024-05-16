import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs';
import {inject} from '@angular/core';
import {AdminService} from "../services/admin/admin.service";
import {SUCCESS_CODE} from "../utility/common/response-code";


export const CreateTripResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const adminService = inject(AdminService);
  return adminService.getAllTripCategoryList().pipe(
    map((res)=>{
      if(res.status && res.status == SUCCESS_CODE && res.data && res.data.tripCategoryDtos&& res.data.tripCategoryDtos.length>0){
        return res.data.tripCategoryDtos.map((val)=>{
          return {id:val.id, description: val.name}
        });
      }else{
        return [];
      }
    })
  )
};

