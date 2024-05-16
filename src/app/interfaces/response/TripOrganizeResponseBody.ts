import {OrganizedTrip} from "../create-trip/OrganizedTrip";

export interface TripOrganizeResponseBody {
  count: number;
  tripDto: OrganizedTrip[];
}
