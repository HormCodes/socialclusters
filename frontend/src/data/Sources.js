import axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";

export function getSources() {
  return axios.get(`${API_URL}/sources/`, {
    headers: getAuthHeaders()
  })
}

export function addSource(source) {
  return axios.post(`${API_URL}/sources/`, source, {
    headers: getAuthHeaders()
  })
}

export function deleteSource(sourceId) {
  return axios.delete(`${API_URL}/sources/${sourceId}`, {
    headers: getAuthHeaders()
  })
}

export function saveSource(source) {
  return axios.put(`${API_URL}/sources/${source.id}`, source, {
    headers: getAuthHeaders()
  })
}
