import axios from 'axios';
const API = axios.create({
    baseURL:'https://task-manager-api-gk9s.onrender.com',
});

//Automatically attach every token to request   
API.interceptors.request.use((config)=> {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.token) {
            config.headers.Authorization= `Bearer ${user.token}`;
        }
    }
    return config;
});
export default API;
