import axios from 'axios'

axios.interceptors.request.use(
    (config) => {
        const auth = localStorage.getItem('authorization')
        config.headers = {
            "Accept": "application/json",
            'Content-Type': 'application.json',
            "Authorization": auth
        }
    }
)