import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ActionCard from "./ActionCard";

const styles = theme => ({});

const WithoutTopicCard = ({handleShowButtonClick, numberOfWithoutTopic}) =>
  <ActionCard
    title={"Without Topic"}
    text={`${numberOfWithoutTopic} posts haven't topic.`}
    buttonTitle={"Show"}
    handleButtonClick={handleShowButtonClick}
  />;

WithoutTopicCard.propTypes = {
  handleShowButtonClick: PropTypes.func.isRequired,
  numberOfWithoutTopic: PropTypes.number.isRequired,
};

WithoutTopicCard.defaultProps = {
  handleShowButtonClick: () => {
  },
  numberOfWithoutTopic: 0
};

export default withStyles(styles)(WithoutTopicCard)
