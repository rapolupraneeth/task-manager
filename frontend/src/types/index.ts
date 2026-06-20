export interface User {
    _id:string;
    name:string;
    email:string;
    token:string;
}
export interface Task {
    _id:string;
    title:string;
    description?:string;
    status:'pending'|'in-progress'|'completed';
    priority:'low'|'medium'|'high';
    dueDate:string;
    completedAt?:string;
    createdAt:string;
    updatedAt:string;
}