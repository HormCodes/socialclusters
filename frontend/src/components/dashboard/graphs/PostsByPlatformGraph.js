import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GraphCard from "./GraphCard";
import Chart from "react-google-charts";

const styles = theme => ({});

const PostsByPlatformGraph = ({countsByDay, platforms}) =>
  <GraphCard
    title={"Posts by Platform"}
  >
    <Chart
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={[]}
      //data={getPostsByPlatformData(countsByDay, platforms)}
      // For tests
      rootProps={{'data-testid': '2'}}
    />
  </GraphCard>;

PostsByPlatformGraph.propTypes = {
  countsByDay: PropTypes.array.isRequired,
  platforms: PropTypes.array.isRequired,
};

PostsByPlatformGraph.defaultProps = {
  countsByDay: [],
  platforms: [],
};

export default withStyles(styles)(PostsByPlatformGraph)
