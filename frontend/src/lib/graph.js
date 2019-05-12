const moment = require("moment"); // TODO - New imports

const getTopicNames = (topics) => topics.map(topic => topic.name);
const getPlatformNames = (platforms) => platforms.map(platform => platform.name);
const getDateString = (timestamp) => moment(timestamp).format("M/D/Y");

const getCountsByTopic = (countsByTopic, topics) => topics.map(topic => topic.textId).map(id => countsByTopic[countsByTopic.map(countByTopic => countByTopic.topic).indexOf(id)].count);

const getCountsByPlatform = (countsByPlatform, platforms) => platforms.map(platform => platform.id).map(id => countsByPlatform[countsByPlatform.map(countByPlatform => countByPlatform.platform).indexOf(id)].count);

export function getPostsByTopicData(countsByDay, topics) {
  return [['Day', ...getTopicNames(topics)], ...countsByDay.map(countByDay => [getDateString(countByDay.timestamp), ...getCountsByTopic(countByDay.countsByTopic, topics)])]
}

export function getPostsBySuggestedTopicData(countsByDay, topics) {
  return [['Day', ...getTopicNames(topics)], ...countsByDay.map(countByDay => [getDateString(countByDay.timestamp), ...getCountsByTopic(countByDay.countsBySuggestedTopic, topics)])]
}

export function getPostsData(countsByDay) {
  return [['Day', 'Count'], ...countsByDay.map(countByDay => [getDateString(countByDay.timestamp), countByDay.count])]
}

export function getPostsByPlatformData(countsByDay, platfroms) {
  return [['Day', ...getPlatformNames(platfroms)], ...countsByDay.map(countByDay => [getDateString(countByDay.timestamp), ...getCountsByPlatform(countByDay.countsByPlatform, platfroms)])]
}
