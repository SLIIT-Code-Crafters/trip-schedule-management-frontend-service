import {TripSubOption} from "./TripSubOption";

export interface TripOption {
  id: string;
  displayName: string;
  optionsSet: TripSubOption[];
}
