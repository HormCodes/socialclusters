import axios from "axios";
import {API_URL} from "./Constants";


export function scrapeData() {
  return axios.get(`${API_URL}/job/data`)
}
