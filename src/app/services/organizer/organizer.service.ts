import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TripCategoryCreateRequest} from "../../interfaces/request/TripCategoryCreateRequest";
import {CommonResponse} from "../../interfaces/response/CommonResponse";
import {TripCategoryUpdateRequest} from "../../interfaces/request/TripCategoryUpdateRequest";
import {CommonFunctionsService} from "../common/common-functions.service";
import {TripCategoryResponseBody} from "../../interfaces/response/TripCategoryResponseBody";
import {TRIPSERVICE} from "../../utility/common/common-constant";
import {OrganizedTrip} from "../../interfaces/create-trip/OrganizedTrip";

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  constructor(
    private http: HttpClient,
    private commonService: CommonFunctionsService
  ) {
  }

  createOrganizedTrip(data: TripCategoryCreateRequest): Observable<CommonResponse<OrganizedTrip>> {
    const url = `${TRIPSERVICE}api/v1/private/trip-categories/save`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('requestId', 'createTripCat');
    return this.http.post<CommonResponse<OrganizedTrip>>(url, data, {params: httpParams});
  }

  updateOrganizedTrip(id: string, data: TripCategoryUpdateRequest): Observable<CommonResponse<OrganizedTrip>> {
    const url = `${TRIPSERVICE}api/v1/private/trip-categories/update/${id}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('requestId', 'updateTripCat');
    return this.http.put<CommonResponse<OrganizedTrip>>(url, data, {params: httpParams});
  }

  removeOrganizedTrip(id: string, deletedBy: string): Observable<CommonResponse<OrganizedTrip>> {
    const url = `${TRIPSERVICE}api/v1/private/trip-categories/delete/${id}`;
    let httpParams = new HttpParams();
    httpParams = httpParams.set('deletedBy', deletedBy);
    httpParams = httpParams.set('requestId', 'deleteTripCat');
    return this.http.delete<CommonResponse<OrganizedTrip>>(url, {params: httpParams});
  }

  getAllOrganizedTrip(paramMap: Map<string, string>): Observable<CommonResponse<TripCategoryResponseBody>> {
    const url = `${TRIPSERVICE}api/v1/private/trip-categories/get-all?requestId=getTripCat`;
    let httpParams = this.commonService.getDataTableHttpParam(paramMap);
    return this.http.get<CommonResponse<TripCategoryResponseBody>>(url, {params: httpParams});
  }
}
