import {getPostsByTopicData, getPostsData} from "../src/lib/graph";

const oneWeekData = [
  {
    "timestamp": "2019-01-13T00:00Z",
    "count": 0,
    "countsByTopic": [
      {
        "topic": "culture",
        "count": 0
      },
      {
        "topic": "traffic",
        "count": 0
      }
    ]
  },
  {
    "timestamp": "2019-01-14T00:00Z",
    "count": 0,
    "countsByTopic": [
      {
        "topic": "culture",
        "count": 0
      },
      {
        "topic": "traffic",
        "count": 0
      }
    ]
  },
  {
    "timestamp": "2019-01-15T00:00Z",
    "count": 1,
    "countsByTopic": [
      {
        "topic": "culture",
        "count": 0
      },
      {
        "topic": "traffic",
        "count": 1
      }
    ]
  },
  {
    "timestamp": "2019-01-16T00:00Z",
    "count": 1,
    "countsByTopic": [
      {
        "topic": "culture",
        "count": 1
      },
      {
        "topic": "traffic",
        "count": 0
      }
    ]
  },
  {
    "timestamp": "2019-01-17T00:00Z",
    "count": 0,
    "countsByTopic": [
      {
        "topic": "culture",
        "count": 0
      },
      {
        "topic": "traffic",
        "count": 0
      }
    ]
  }
];


describe("getPostsByTopicData", () => {

  describe('for empty data', () => {
    test('should return empty table', () => {
      expect(getPostsByTopicData([], [])).toEqual([['Day']]);
    });
  });

  describe('for data in one week', function () {

    const topics = [
      {name: "Traffic", textId: "traffic"},
      {name: "Culture", textId: "culture"},
    ];

    test('should return data without another topic order affect', () => {
      let result = [
        ['Day', "Traffic", "Culture"],
        ["Sun Jan 13 2019", 0, 0],
        ["Mon Jan 14 2019", 0, 0],
        ["Tue Jan 15 2019", 1, 0],
        ["Wed Jan 16 2019", 0, 1],
        ["Thu Jan 17 2019", 0, 0],
      ];
      expect(getPostsByTopicData(oneWeekData, topics)).toEqual(result);
    });
  });

});

describe('getPostsData', () => {
  describe('for empty data', function () {
    test('should return empty table', () => {
      expect(getPostsData([])).toEqual([['Day', 'Count']])
    });
  });
  describe('for on week data', function () {
    test('should return data in table', () => {

      let result = [
        ['Day', "Count"],
        ["Sun Jan 13 2019", 0],
        ["Mon Jan 14 2019", 0],
        ["Tue Jan 15 2019", 1],
        ["Wed Jan 16 2019", 1],
        ["Thu Jan 17 2019", 0],
      ];

      expect(getPostsData(oneWeekData)).toEqual(result)
    });
  });
});
