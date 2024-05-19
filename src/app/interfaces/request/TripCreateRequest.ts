import {OrganizedTrip} from "../create-trip/OrganizedTrip";

export interface TripCreateRequest {
  userDto:{id:string, userName:string};
  tripRequest:OrganizedTrip;
}
