import API from './axios';
import type {User} from '../types';
interface RegisterData {
    name:string;
    email:string;
    password:string;
}
interface LoginData {
    email:string;
    password:string;
}
export const registerUser = async (data: RegisterData):Promise<User>=>{
    const response = await API.post<User>('/auth/register',data);
    return response.data;
}
export const loginUser = async (data:LoginData):Promise<User>=>{
    const response = await API.post<User>('/auth/login',data);
    return response.data;
}