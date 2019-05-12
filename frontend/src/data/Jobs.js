import axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";


export function scrapeData() {
  return axios.get(`${API_URL}/jobs/data`, {
    headers: getAuthHeaders()
  })
}
