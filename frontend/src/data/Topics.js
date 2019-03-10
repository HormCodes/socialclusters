import axios from "axios";
import {API_URL} from "./Constants";

export function getTopics() {
  return axios.get(`${API_URL}/topics/`)
}

export function addTopic(topic) {
  return axios.post(`${API_URL}/topics/`, topic)
}

export function deleteTopic(topicId) {
  return axios.delete(`${API_URL}/topics/${topicId}`)
}

export function saveTopic(topic) {
  return axios.put(`${API_URL}/topics/${topic.id}`, topic)
}
