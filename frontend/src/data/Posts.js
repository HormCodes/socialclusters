import axios from "axios";

const API_URL = "http://localhost:8080"; // TODO - Dev Env


export function getPostsAsPage(pageSize, pageNumber, filterWithTopic) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber
    }
  };

  return axios.get(`${API_URL}/contents/twitter/`, config);
};
