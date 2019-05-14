import axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";

export function getLastTrainedModel() {
  return axios.get(`${API_URL}/analysis/topic/trainings/last`, {
    headers: getAuthHeaders()
  });
}

export function getLastModelInTraining() {
  return axios.get(`${API_URL}/analysis/topic/trainings/running`, {
    headers: getAuthHeaders()
  });
}

export function suggestTopics() {
  return axios.post(`${API_URL}/analysis/topic/suggestions`, {}, {
    headers: getAuthHeaders()
  });
}

export function trainModel() {
  return axios.post(`${API_URL}/analysis/topic/trainings`, {}, {
    headers: getAuthHeaders()
  });
}
