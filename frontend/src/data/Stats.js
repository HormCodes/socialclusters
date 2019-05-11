import * as axios from "axios";
import {API_URL} from "./Constants";

export function getCountsByDay(from, to) {
  return axios.get(`${API_URL}/stats`, {
    params: {
      from,
      to
    }
  })
}
