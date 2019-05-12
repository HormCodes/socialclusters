import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import GraphCard from "./GraphCard";
import ReactWordcloud from "react-wordcloud";

const styles = theme => ({});

const WordCountsGraph = ({wordCounts}) =>
  <GraphCard
    title={"Words"}
  >
    <ReactWordcloud words={wordCounts.map(wordCount => {
      return {text: wordCount.word, value: wordCount.count}
    })}/>
  </GraphCard>;

WordCountsGraph.propTypes = {
  wordCounts: PropTypes.array.isRequired,
};

WordCountsGraph.defaultProps = {
  wordCounts: [],
};

export default withStyles(styles)(WordCountsGraph)
