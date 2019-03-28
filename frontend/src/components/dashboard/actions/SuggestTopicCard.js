import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ActionCard from "./ActionCard";
import moment from "moment";

const styles = theme => ({});

const SuggestTopicCard = ({handleSuggestButtonClick, lastSuggestionTimestamp}) =>
  <ActionCard
    title={"Suggestion"}
    text={`Last suggestion was: ${lastSuggestionTimestamp ? moment(lastSuggestionTimestamp, "X").fromNow() : "No suggestion executed"}`}
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
