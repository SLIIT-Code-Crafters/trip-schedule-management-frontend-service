import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {TripCategoryCreateRequest} from "../../interfaces/request/TripCategoryCreateRequest";
import {CommonResponse} from "../../interfaces/response/CommonResponse";
import {TripCategoryUpdateRequest} from "../../interfaces/request/TripCategoryUpdateRequest";
import {CommonFunctionsService} from "../common/common-functions.service";
import {TripCategoryResponseBody} from "../../interfaces/response/TripCategoryResponseBody";
import {TRIPMNGSERVICE, TRIPSERVICE} from "../../utility/common/common-constant";
import {OrganizedTrip} from "../../interfaces/create-trip/OrganizedTrip";
import {TripOrganizeResponseBody} from "../../interfaces/response/TripOrganizeResponseBody";
import {TripCreateRequest} from "../../interfaces/request/TripCreateRequest";
import {TripMedia} from "../../interfaces/create-trip/create-trip-option/TripMedia";

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  constructor(
    private http: HttpClient,
    private commonService: CommonFunctionsService
  ) {
  }

  createOrganizedTrip(data: FormData): Observable<CommonResponse<OrganizedTrip>> {
    const url = `${TRIPMNGSERVICE}api/v1/private/trip/create-trip?requestId=createTrip`;
    return this.http.post<CommonResponse<OrganizedTrip>>(url, data);
  }

  updateOrganizedTrip(data: any): Observable<CommonResponse<any>> {
    const url = `${TRIPMNGSERVICE}api/v1/private/trip/update-trip-main-details?requestId=updateTrip`;
    return this.http.post<CommonResponse<any>>(url, data);
  }

  updateOrganizedTripOptions(data: any): Observable<CommonResponse<any>> {
    const url = `${TRIPMNGSERVICE}api/v1/private/trip/update-trip-options?requestId=updateTripOption`;
    return this.http.post<CommonResponse<any>>(url, data,{
      responseType: 'json'
    });
  }

  removeOrganizedTrip(data:any): Observable<CommonResponse<any>> {
    const url = `${TRIPSERVICE}api/v1/private/trip/remove-trip?requestId=removeTrip`;
    return this.http.delete<CommonResponse<any>>(url, {body:data});
  }

  getAllOrganizedTrip(paramMap: Map<string, string>): Observable<CommonResponse<TripOrganizeResponseBody>> {
    const url = `${TRIPSERVICE}api/v1/private/trip/get-trip-details-by-id?requestId=getTripCat`;
    let httpParams = this.commonService.getDataTableHttpParam(paramMap);
    return this.http.get<CommonResponse<TripOrganizeResponseBody>>(url, {params: httpParams});
  }

  getMedia(media:TripMedia): Observable<Blob> {
    const url = media.uniqueName;
    return this.http.get(url, {responseType: "blob"});
  }

  addMedia(data: FormData): Observable<CommonResponse<any>> {
    const url = `${TRIPMNGSERVICE}api/v1/private/trip/add-trip-media?requestId=addMedia`;
    return this.http.post<CommonResponse<any>>(url, data);
  }

  removeMedia(data: any): Observable<CommonResponse<any>> {
    const url = `${TRIPMNGSERVICE}api/v1/private/trip/remove-trip-media?requestId=removeMedia`;
    return this.http.delete<CommonResponse<any>>(url,{body:data});
  }
}
