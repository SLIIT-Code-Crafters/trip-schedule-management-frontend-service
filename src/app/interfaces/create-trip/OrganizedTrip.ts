import {TripOption} from "./create-trip-option/TripOption";
import {TripMedia} from "./create-trip-option/TripMedia";

export interface OrganizedTrip {
  id: string;
  code: string;

  tripCategory: string;
  tripName: string;
  description: string;
  fromDate: string;
  toDate: string;
  closingDate: string;
  finalCancelDate: string;
  maxParticipationCount: string;
  advertisementName: string;
  advertisementDescription: string;

  tipOptionList:TripOption[];
  mediaList:TripMedia[];

  status: string;
  createdBy: string;
  createdDate: string;
}
