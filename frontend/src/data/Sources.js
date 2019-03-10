import axios from "axios";
import {API_URL} from "./Constants";

export function getSources() {
  return axios.get(`${API_URL}/sources/`)
}

export function addSource(source) {
  return axios.post(`${API_URL}/sources/`, source)
}

export function deleteSource(sourceId) {
  return axios.delete(`${API_URL}/sources/${sourceId}`)
}

export function saveSource(source) {
  return axios.put(`${API_URL}/sources/${source.id}`, source)
}
