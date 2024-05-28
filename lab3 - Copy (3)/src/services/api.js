import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    getUsers() {
        return apiClient.get('/users');
    },
    getUserByName(name) {
        return apiClient.get(`/users/${name}`);
    },
    addUser(user) {
        return apiClient.post('/users', user);
    },
    updateUserSessions(name, sessions) {
        return apiClient.put(`/users/${name}`, { sessions });
    }
};
