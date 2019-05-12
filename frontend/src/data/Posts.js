import axios from "axios";
import {
  API_URL,
  PLATFORM_FACEBOOK,
  PLATFORM_MEETUP,
  PLATFORM_NEWS,
  PLATFORM_REDDIT,
  PLATFORM_TWITTER
} from "./Constants";
import {getAuthHeaders} from "./Auth";

function getPostsAsPage(platform, filterWithoutTopic, topics, pageSize, pageNumber, sort) {
  let config = {
    headers: getAuthHeaders(),
    params: {
      withoutTopic: filterWithoutTopic,
      topics: topics.join(),
      size: pageSize,
      page: pageNumber,
      sort: sort || ''
    }
  };

  return axios.get(`${API_URL}/contents/${platform}/`, config);
}

function deletePost(platform, postId) {
  return axios.delete(`${API_URL}/contents/${platform}/${postId}`, {
    headers: getAuthHeaders()
  })
}

function savePostTopics(platform, postId, topics) {
  return axios.patch(`${API_URL}/contents/${platform}/${postId}/topics`, topics, {
    headers: getAuthHeaders()
  })
}


export function getTwitterPostsAsPage(pageSize, pageNumber, filterWithoutTopic, topics, sort) {
  return getPostsAsPage(PLATFORM_TWITTER, filterWithoutTopic, topics, pageSize, pageNumber, sort)
}

export function deleteTwitterPost(postId) {
  return deletePost(PLATFORM_TWITTER, postId)
}

export function saveTwitterPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_TWITTER, postId, topics)
}


export function getFacebookPostsAsPage(pageSize, pageNumber, filterWithoutTopic, topics, sort) {
  return getPostsAsPage(PLATFORM_FACEBOOK, filterWithoutTopic, topics, pageSize, pageNumber, sort)
}

export function deleteFacebookPost(postId) {
  return deletePost(PLATFORM_FACEBOOK, postId)
}

export function saveFacebookPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_FACEBOOK, postId, topics)
}


export function getNewsPostsAsPage(pageSize, pageNumber, filterWithoutTopic, topics, sort) {
  return getPostsAsPage(PLATFORM_NEWS, filterWithoutTopic, topics, pageSize, pageNumber, sort)
}

export function deleteNewsPost(postId) {
  return deletePost(PLATFORM_NEWS, postId)
}

export function saveNewsPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_NEWS, postId, topics)
}


export function getRedditPostsAsPage(pageSize, pageNumber, filterWithoutTopic, topics, sort) {
  return getPostsAsPage(PLATFORM_REDDIT, filterWithoutTopic, topics, pageSize, pageNumber, sort)
}

export function deleteRedditPost(postId) {
  return deletePost(PLATFORM_REDDIT, postId)
}

export function saveRedditPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_REDDIT, postId, topics)
}


export function getMeetupPostsAsPage(pageSize, pageNumber, filterWithoutTopic, topics, sort) {
  return getPostsAsPage(PLATFORM_MEETUP, filterWithoutTopic, topics, pageSize, pageNumber, sort)
}

export function deleteMeetupPost(postId) {
  return deletePost(PLATFORM_MEETUP, postId)
}

export function saveMeetupPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_MEETUP, postId, topics)
}


