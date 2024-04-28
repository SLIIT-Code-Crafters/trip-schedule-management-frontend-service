export interface CommonResponse<T> {
  data:T;
  message:string;
  requestId:string;
  status:number;
  success:boolean
  timestamp:string;
}
