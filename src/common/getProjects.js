import axios from "axios";
let auth = localStorage.getItem('authorization')

const projectsUrl = 'https://dev.api.wurk.skyver.co/api/';
const headers = {
    "Accept": "application/json",
    'Content-Type': 'application.json',
    "Authorization": auth
}
export default{
    getProjects(){
        return axios.get(`${projectsUrl}projects`, { headers })
    },
    getProjectsByID(id){
        return axios.get(`${projectsUrl}projects/${id}`, { headers })
    },
    saveProjects(payload){
        return axios.put(`${projectsUrl}projects/${payload.id}`,  payload, { headers })
    },
    getPayments() {
        return axios.get(`${projectsUrl}payments`, { headers })
    },
    getPaymentById(id) {
        return axios.get(`${projectsUrl}payments/${id}`, { headers })
    },
    addPayment(payload) {
        return axios.post(`${projectsUrl}payments/${payload.id}/pay`,  {...payload} , { headers })
    }
}