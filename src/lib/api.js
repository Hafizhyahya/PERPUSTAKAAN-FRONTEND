const API_URL = 'http://localhost:8000/api';

export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token');

    return fetch(`${API_URL}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
    });
}
