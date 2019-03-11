import axios from "axios";
import {API_URL} from "./Constants";

export function getTwitterPostsAsPage(pageSize, pageNumber, filterWithTopic) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber
    }
  };

  return axios.get(`${API_URL}/contents/twitter/`, config);
}

export function deleteTwitterPost(postId) {
  return axios.delete(`${API_URL}/contents/twitter/${postId}`)
}

export function saveTwitterPostTopics(postId, topics) {
  return axios.patch(`${API_URL}/contents/twitter/${postId}/topics`, topics)
}


export function getFacebookPostsAsPage(pageSize, pageNumber, filterWithTopic) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber
    }
  };

  return axios.get(`${API_URL}/contents/facebook/`, config);
}

export function deleteFacebookPost(postId) {
  return axios.delete(`${API_URL}/contents/facebook/${postId}`)
}


export function getNewsPostsAsPage(pageSize, pageNumber, filterWithTopic) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber
    }
  };

  return axios.get(`${API_URL}/contents/news/`, config);
}

export function deleteNewsPost(postId) {
  return axios.delete(`${API_URL}/contents/news/${postId}`)
}


export function getRedditPostsAsPage(pageSize, pageNumber, filterWithTopic) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber
    }
  };

  return axios.get(`${API_URL}/contents/reddit/`, config);
}

export function deleteRedditPost(postId) {
  return axios.delete(`${API_URL}/contents/reddit/${postId}`)
}


export function getMeetupPostsAsPage(pageSize, pageNumber, filterWithTopic) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber
    }
  };

  return axios.get(`${API_URL}/contents/meetup/`, config);
}

export function deleteMeetupPost(postId) {
  return axios.delete(`${API_URL}/contents/meetup/${postId}`)
}
