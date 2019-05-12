export function getTopicsForAPI(topics) {
  return Object.keys(topics).map(function (key, index) {
    if (topics[key]) {
      return key
    } else {
      return ""
    }
  }).filter(topic => topic !== "");
}
