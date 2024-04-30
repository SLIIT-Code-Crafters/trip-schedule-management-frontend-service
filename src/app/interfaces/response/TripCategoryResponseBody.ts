import {TripCategory} from "../trip-category/TripCategory";

export interface TripCategoryResponseBody {
  count:number;
  tripCategoryDtos:TripCategory[];
}
