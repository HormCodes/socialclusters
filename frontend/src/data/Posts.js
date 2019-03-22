import axios from "axios";
import {
  API_URL,
  PLATFORM_FACEBOOK,
  PLATFORM_MEETUP,
  PLATFORM_NEWS,
  PLATFORM_REDDIT,
  PLATFORM_TWITTER
} from "./Constants";

function getPostsAsPage(platform, filterWithTopic, pageSize, pageNumber, sort) {
  let config = {
    params: {
      withoutTopic: filterWithTopic,
      size: pageSize,
      page: pageNumber,
      sort: sort || ''
    }
  };

  return axios.get(`${API_URL}/contents/${platform}/`, config);
}

function deletePost(platform, postId) {
  return axios.delete(`${API_URL}/contents/${platform}/${postId}`)
}

function savePostTopics(platform, postId, topics) {
  return axios.patch(`${API_URL}/contents/${platform}/${postId}/topics`, topics)
}


export function getTwitterPostsAsPage(pageSize, pageNumber, filterWithTopic, sort) {
  return getPostsAsPage(PLATFORM_TWITTER, filterWithTopic, pageSize, pageNumber, sort)
}

export function deleteTwitterPost(postId) {
  return deletePost(PLATFORM_TWITTER, postId)
}

export function saveTwitterPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_TWITTER, postId, topics)
}


export function getFacebookPostsAsPage(pageSize, pageNumber, filterWithTopic, sort) {
  return getPostsAsPage(PLATFORM_FACEBOOK, filterWithTopic, pageSize, pageNumber, sort)
}

export function deleteFacebookPost(postId) {
  return deletePost(PLATFORM_FACEBOOK, postId)
}

export function saveFacebookPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_FACEBOOK, postId, topics)
}


export function getNewsPostsAsPage(pageSize, pageNumber, filterWithTopic, sort) {
  return getPostsAsPage(PLATFORM_NEWS, filterWithTopic, pageSize, pageNumber, sort)
}

export function deleteNewsPost(postId) {
  return deletePost(PLATFORM_NEWS, postId)
}

export function saveNewsPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_NEWS, postId, topics)
}


export function getRedditPostsAsPage(pageSize, pageNumber, filterWithTopic, sort) {
  return getPostsAsPage(PLATFORM_REDDIT, filterWithTopic, pageSize, pageNumber, sort)
}

export function deleteRedditPost(postId) {
  return deletePost(PLATFORM_REDDIT, postId)
}

export function saveRedditPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_REDDIT, postId, topics)
}


export function getMeetupPostsAsPage(pageSize, pageNumber, filterWithTopic, sort) {
  return getPostsAsPage(PLATFORM_MEETUP, filterWithTopic, pageSize, pageNumber, sort)
}

export function deleteMeetupPost(postId) {
  return deletePost(PLATFORM_MEETUP, postId)
}

export function saveMeetupPostTopics(postId, topics) {
  return savePostTopics(PLATFORM_MEETUP, postId, topics)
}


