import axios from "axios";

let auth = localStorage.getItem('authorization')
const base_Url = 'https://dev.api.wurk.skyver.co/api/employees'
const headers = {
    "Accept": "application/json",
    'Content-Type': 'application.json',
    "Authorization": auth
}
export default{
    getEmployees(){
        return axios.get(base_Url, { headers })
    },
}