import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.setItem('redirectAfterLogin', currentPath)
            window.location.href = '/session-expired'
        }
        return Promise.reject(error)
    }
)
export default api