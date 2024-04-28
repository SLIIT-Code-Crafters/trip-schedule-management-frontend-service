import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TripCategoryCreateRequest} from "../../interfaces/request/TripCategoryCreateRequest";
import {CommonResponse} from "../../interfaces/response/CommonResponse";
import {TripCategory} from "../../interfaces/trip-category/TripCategory";
import {TripCategoryUpdateRequest} from "../../interfaces/request/TripCategoryUpdateRequest";
import {CommonFunctionsService} from "../common/common-functions.service";
import {TripCategoryResponseBody} from "../../interfaces/response/TripCategoryResponseBody";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  environment =
    'https://78s6fnyfl5.execute-api.ap-southeast-1.amazonaws.com/prod/';

  constructor(
    private http: HttpClient,
    private commonService:CommonFunctionsService
  ) {}

  createTripCategory(data: TripCategoryCreateRequest): Observable<CommonResponse<TripCategory>> {
    const url = `${this.environment}api/v1/private/trip-categories/save`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('requestId', '123');
    return this.http.post<CommonResponse<TripCategory>>(url, data, {params: httpParams});
  }

  updateTripCategory(id:string, data: TripCategoryUpdateRequest): Observable<CommonResponse<TripCategory>> {
    const url = `${this.environment}api/v1/private/trip-categories/update/${id}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('requestId', '123');
    return this.http.put<CommonResponse<TripCategory>>(url, data, {params: httpParams});
  }

  removeTripCategory(id:string, deletedBy:string): Observable<CommonResponse<TripCategory>> {
    const url = `${this.environment}api/v1/private/trip-categories/delete/${id}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('deletedBy', deletedBy);
    httpParams = httpParams.set('requestId', '1110');
    return this.http.delete<CommonResponse<TripCategory>>(url, {params: httpParams});
  }

  getAllTripCategory(paramMap: Map<string, string>): Observable<CommonResponse<TripCategoryResponseBody>> {
    const url = `${this.environment}api/v1/private/trip-categories/get-all?requestId=123`;
    let httpParams = this.commonService.getDataTableHttpParam(paramMap);
    return this.http.get<CommonResponse<TripCategoryResponseBody>>(url, {params: httpParams});
  }
}
