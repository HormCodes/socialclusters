import React from "react";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ActionCard from "./ActionCard";

const styles = theme => ({});

const ScrapeDataCard = ({handleScrapeButtonClick}) =>
  <ActionCard
    title={"Scrape Data"}
    text={``}
    buttonTitle={"Scrape"}
    handleButtonClick={handleScrapeButtonClick}
  />;

ScrapeDataCard.propTypes = {
  handleScrapeButtonClick: PropTypes.func.isRequired,
};

ScrapeDataCard.defaultProps = {
  handleScrapeButtonClick: () => {
  }
};

export default withStyles(styles)(ScrapeDataCard)
