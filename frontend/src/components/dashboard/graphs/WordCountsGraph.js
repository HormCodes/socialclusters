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
    <div>
      <ReactWordcloud
        options={{
          fontFamily: "Roboto",
          fontSizes: [20, 30, 40, 50, 60, 70, 80, 90, 100].map(value => value * 1.5),
          colors: ["#4285f4", "#db4437", "#f4b400", "#109c58"],
          rotations: 0
        }}
        words={wordCounts.map(wordCount => {
          return {text: wordCount.word, value: wordCount.count}
        })}/>
    </div>


  </GraphCard>;

WordCountsGraph.propTypes = {
  wordCounts: PropTypes.array.isRequired,
};

WordCountsGraph.defaultProps = {
  wordCounts: [],
};

export default withStyles(styles)(WordCountsGraph)
