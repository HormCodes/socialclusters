import axios from "axios";
import {API_URL} from "./Constants";

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
