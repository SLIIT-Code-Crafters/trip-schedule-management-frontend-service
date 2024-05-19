import {TripSubOption} from "./TripSubOption";

export interface TripOption {
  id: string|null;
  name: string;
  tripOptionSelection: TripSubOption[];
}
