import * as axios from "axios";
import {API_URL} from "./Constants";

export function getModelStatus() {
  return axios.get(`${API_URL}/model/status`)
}
