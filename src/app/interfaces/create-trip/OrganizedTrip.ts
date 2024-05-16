import {TripOption} from "./create-trip-option/TripOption";
import {TripMedia} from "./create-trip-option/TripMedia";
import {TripCategory} from "../trip-category/TripCategory";

export interface OrganizedTrip {
  id: string;

  tripCategoryList: TripCategory[];
  tripName: string;
  description: string;
  fromDate: string;
  toDate: string;
  reservationCloseDate: string;
  finalCancelDate: string;
  maxParticipantCount: string;
  advertise_tripName: string;
  adertise_tripDetails: string;

  tripOptionList:TripOption[];

  documents: string;
  documentList:TripMedia[];

  status: string;

  createdBy: string;
  createdDate: string;
}
