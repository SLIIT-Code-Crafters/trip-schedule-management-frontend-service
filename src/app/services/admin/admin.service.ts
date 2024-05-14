import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TripCategoryCreateRequest} from "../../interfaces/request/TripCategoryCreateRequest";
import {CommonResponse} from "../../interfaces/response/CommonResponse";
import {TripCategory} from "../../interfaces/trip-category/TripCategory";
import {TripCategoryUpdateRequest} from "../../interfaces/request/TripCategoryUpdateRequest";
import {CommonFunctionsService} from "../common/common-functions.service";
import {TripCategoryResponseBody} from "../../interfaces/response/TripCategoryResponseBody";
import {ENVIRONMENT2} from "../../utility/common/common-constant";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient,
    private commonService: CommonFunctionsService
  ) {
  }

  createTripCategory(data: TripCategoryCreateRequest): Observable<CommonResponse<TripCategory>> {
    const url = `${ENVIRONMENT2}api/v1/private/trip-categories/save`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('requestId', 'createTripCat');
    return this.http.post<CommonResponse<TripCategory>>(url, data, {params: httpParams});
  }

  updateTripCategory(id: string, data: TripCategoryUpdateRequest): Observable<CommonResponse<TripCategory>> {
    const url = `${ENVIRONMENT2}api/v1/private/trip-categories/update/${id}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('requestId', 'updateTripCat');
    return this.http.put<CommonResponse<TripCategory>>(url, data, {params: httpParams});
  }

  removeTripCategory(id: string, deletedBy: string): Observable<CommonResponse<TripCategory>> {
    const url = `${ENVIRONMENT2}api/v1/private/trip-categories/delete/${id}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('deletedBy', deletedBy);
    httpParams = httpParams.set('requestId', 'deleteTripCat');
    return this.http.delete<CommonResponse<TripCategory>>(url, {params: httpParams});
  }

  getAllTripCategory(paramMap: Map<string, string>): Observable<CommonResponse<TripCategoryResponseBody>> {
    const url = `${ENVIRONMENT2}api/v1/private/trip-categories/get-all?requestId=getTripCat`;
    let httpParams = this.commonService.getDataTableHttpParam(paramMap);
    return this.http.get<CommonResponse<TripCategoryResponseBody>>(url, {params: httpParams});
  }
}
