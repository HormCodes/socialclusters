import axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";

export function getModelStatus() {
  return axios.get(`${API_URL}/analysis/topic/accuracy`, {
    headers: getAuthHeaders()
  });
}

export function suggestTopics() {
  return axios.get(`${API_URL}/analysis/topic/suggestion`, {
    headers: getAuthHeaders()
  });
}
