import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ActionCard from "./WithoutTopicCard";

const styles = theme => ({});

const WithSuggestedTopicCard = ({handleShowButtonClick, numberOfPostsWithSuggested}) =>
  <ActionCard
    title={"With Suggested Topic"}
    text={`${numberOfPostsWithSuggested} posts have suggested topic.`}
    buttonTitle={"Show"}
    handleButtonClick={handleShowButtonClick}
  />;

WithSuggestedTopicCard.propTypes = {
  handleShowButtonClick: PropTypes.func.isRequired,
  numberOfPostsWithSuggested: PropTypes.number.isRequired,
};

WithSuggestedTopicCard.defaultProps = {
  handleShowButtonClick: () => {
  },
  numberOfPostsWithSuggested: 0
};

export default withStyles(styles)(WithSuggestedTopicCard)
