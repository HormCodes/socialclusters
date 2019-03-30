import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GraphCard from "./GraphCard";
import {getPostsBySuggestedTopicData} from "../../../lib/graph";
import Chart from "react-google-charts";

const styles = theme => ({});

const PostsBySuggestedTopicGraph = ({countsByDay, topics}) =>
  <GraphCard
    title={"Posts by Suggested Topic"}
  >
    <Chart
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={getPostsBySuggestedTopicData(countsByDay, topics)}

      options={{
        legend: {position: 'top'}
      }}
      // For tests
      rootProps={{'data-testid': '2'}}
    />
  </GraphCard>;

PostsBySuggestedTopicGraph.propTypes = {
  countsByDay: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
};

PostsBySuggestedTopicGraph.defaultProps = {
  countsByDay: [],
  topics: [],
};

export default withStyles(styles)(PostsBySuggestedTopicGraph)
