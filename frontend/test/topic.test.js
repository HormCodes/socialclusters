import {getTopicsForAPI} from "../src/lib/topics";

describe('getTopicsForAPI', function () {
  it('should return joined array', function () {
    expect(getTopicsForAPI({culture: true, traffic: false, sport: true})).toEqual(["culture", "sport"])
  });
});
