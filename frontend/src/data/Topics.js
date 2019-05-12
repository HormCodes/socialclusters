import axios from "axios";
import {API_URL} from "./Constants";
import {getAuthHeaders} from "./Auth";

export function getTopics() {
  return axios.get(`${API_URL}/topics/`, {
    headers: getAuthHeaders()
  })
}

export function addTopic(topic) {
  return axios.post(`${API_URL}/topics/`, topic, {
    headers: getAuthHeaders()
  })
}

export function deleteTopic(topicId) {
  return axios.delete(`${API_URL}/topics/${topicId}`, {
    headers: getAuthHeaders()
  })
}

export function saveTopic(topic) {
  return axios.put(`${API_URL}/topics/${topic.id}`, topic, {
    headers: getAuthHeaders()
  })
}
