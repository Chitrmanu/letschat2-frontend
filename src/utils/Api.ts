import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const token:any = Cookies.get('token');
const userId:any = Cookies.get('userId');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'token': token ? token.toString() : '',
    'userId': userId ? userId.toString() : '',
  },
});

interface ErrorResponse {
    message: string;
    // Add other properties if needed
  }

export async function fetchAPI<T>(endpoint: string, method: string, data: any | null): Promise<T> {
  const config: AxiosRequestConfig = {
    method,
    url: endpoint,
    data,
  };

  try {
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);
    console.log("response",response);
    return response.data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.response?.data || { message: 'Something went wrong' };
    throw new Error(errorResponse.message);
  }
}