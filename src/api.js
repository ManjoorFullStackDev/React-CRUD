import axios from "axios";

const local =  "http://localhost:5001/api";
// const forDocker = "http://127.0.0.1:5001/api"

const api = axios.create({  
    baseURL: local,
})

export default api; 

