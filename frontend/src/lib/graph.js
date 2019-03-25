const getTopicNames = (topics) => topics.map(topic => topic.name);

const getCountsByTopic = (countsByTopic, topics) => topics.map(topic => topic.textId).map(id => countsByTopic[countsByTopic.map(countByTopic => countByTopic.topic).indexOf(id)].count);

export function getPostsByTopicData(countsByDay, topics) {
  return [['Day', ...getTopicNames(topics)], ...countsByDay.map(countByDay => [(new Date(countByDay.timestamp)).toDateString(), ...getCountsByTopic(countByDay.countsByTopic, topics)])]
}

export function getPostsData(countsByDay) {
  return [['Day', 'Count'], ...countsByDay.map(countByDay => [(new Date(countByDay.timestamp)).toDateString(), countByDay.count])]
}
