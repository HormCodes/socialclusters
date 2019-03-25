import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ActionCard from "./ActionCard";

const styles = theme => ({});

const SuggestTopicCard = ({handleSuggestButtonClick, lastSuggestionTimestamp}) =>
  <ActionCard
    title={"Suggestion"}
    text={`Last suggestion was: ${lastSuggestionTimestamp}`}
    buttonTitle={"Execute"}
    handleButtonClick={handleSuggestButtonClick}
  />;

SuggestTopicCard.propTypes = {
  handleSuggestButtonClick: PropTypes.func.isRequired,
  lastSuggestionTimestamp: PropTypes.string.isRequired,
};

SuggestTopicCard.defaultProps = {
  handleSuggestButtonClick: () => {
  },
  lastSuggestionTimestamp: "Yesterday"
};

export default withStyles(styles)(SuggestTopicCard)
