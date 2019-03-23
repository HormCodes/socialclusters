import {Card} from "@material-ui/core";
import React from "react";
import * as PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({});

const SuggestTopicCard = ({handleSuggestButtonClick, lastSuggestionTimestamp}) =>
  <Card>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        Suggestion
      </Typography>
      <Typography component="p">
        Last suggestion was: {lastSuggestionTimestamp}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color="primary" action={handleSuggestButtonClick}>
        Execute
      </Button>
    </CardActions>
  </Card>;

SuggestTopicCard.propTypes = {
  handleSuggestButtonClick: PropTypes.func.isRequired,
  lastSuggestionTimestamp: PropTypes.string.isRequired,
};

SuggestTopicCard.defaultProps = {
  handleSuggestButtonClick: () => {
  },
  lastSuggestionTimestamp: ""
};

export default withStyles(styles)(SuggestTopicCard)
