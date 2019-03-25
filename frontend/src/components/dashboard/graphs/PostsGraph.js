import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GraphCard from "./GraphCard";
import {getPostsData} from "../../../lib/graph";
import Chart from "react-google-charts";

const styles = theme => ({});

const PostsGraph = ({countsByDay}) =>
  <GraphCard
    title={"Posts"}
  >
    <Chart
      chartType="Line"
      loader={<div>Loading Chart</div>}
      data={getPostsData(countsByDay)}
      // For tests
      rootProps={{'data-testid': '2'}}
    />
  </GraphCard>;

PostsGraph.propTypes = {
  countsByDay: PropTypes.array.isRequired,
};

PostsGraph.defaultProps = {
  countsByDay: [],
};

export default withStyles(styles)(PostsGraph)
