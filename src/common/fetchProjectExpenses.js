import axios from "axios";

let auth = localStorage.getItem('authorization')
const base_Url = 'https://dev.api.wurk.skyver.co/api/expenses'
const projectExpenses = 'https://dev.api.wurk.skyver.co/api/projects'
const headers = {
    "Accept": "application/json",
    'Content-Type': 'application.json',
    "Authorization": auth
}
export default{
    getExpenses(){
        return axios.get(base_Url, { headers })
    },
    getExpensesById(id) {
        return axios.get(`${projectExpenses}/${id}/expenses`, { headers })
    },
    getExpensesId(id) {
        return axios.get(`${base_Url}/${id}`, { headers })
    },
    deleteExpense(payload){
        return axios.delete(`${base_Url}/${payload.id}`, { headers } )
    }
}