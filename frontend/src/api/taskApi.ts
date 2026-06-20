import API from './axios';
import type { Task } from '../types';

interface TaskInput {
    title:string;
    description?:string;
    status?:Task['status'];
    priority:Task['priority'];
    dueDate:string;
}
export const getTasks = async (): Promise <Task[]>=> {
    const response = await API.get<Task[]>('/tasks');
    return response.data;
};
export const createTask = async (data: TaskInput):Promise<Task>=> {
    const response  = await API.post<Task>('/tasks',data);
    return response.data;
}
export const updateTask = async (id:string,data:Partial<TaskInput>):Promise<Task>=>{
    const response =  await API.put<Task>(`/tasks/${id}`,data);
    return response.data;
}
export const deleteTask = async (id:string):Promise<{message:string}>=> {
    const response = await API.delete<{message:string}>(`/tasks/${id}`);
    return response.data;
}