import {TripSubOption} from "./TripSubOption";

export interface TripOption {
  id: string;
  name: string;
  tripOptionSelection: TripSubOption[];
}
