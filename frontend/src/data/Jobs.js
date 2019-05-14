import axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";


export function scrapeData() {
  return axios.post(`${API_URL}/jobs/contentDownloads`, {}, {
    headers: getAuthHeaders()
  })
}
