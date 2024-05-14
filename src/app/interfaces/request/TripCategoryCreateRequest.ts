export interface TripCategoryCreateRequest {
  code: string;
  name: string;
  description: string | null;
  createdBy: string;
}
