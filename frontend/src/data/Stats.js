import * as axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";

export function getStats(from, to) {
  return axios.get(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
    params: {
      from,
      to
    }
  })
}
