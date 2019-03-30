import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GraphCard from "./GraphCard";
import {getPostsByTopicData} from "../../../lib/graph";
import Chart from "react-google-charts";

const styles = theme => ({});

const PostsByTopicGraph = ({countsByDay, topics}) =>
  <GraphCard
    title={"Posts by Topic"}
  >
    <Chart
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={getPostsByTopicData(countsByDay, topics)}

      options={{
        legend: {position: 'top'}
      }}
      // For tests
      rootProps={{'data-testid': '2'}}
    />
  </GraphCard>;

PostsByTopicGraph.propTypes = {
  countsByDay: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
};

PostsByTopicGraph.defaultProps = {
  countsByDay: [],
  topics: [],
};

export default withStyles(styles)(PostsByTopicGraph)
