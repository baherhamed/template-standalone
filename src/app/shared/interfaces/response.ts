/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
  paginationInfo?: any;
  body?: {
    status: number;
    success: boolean;
    message: string;
    data: any;
    paginationInfo?: any;
  };
}
