import {Card} from "@material-ui/core";
import React from "react";
import * as PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({});

const WithSuggestedTopicCard = ({handleShowButtonClick, numberOfPostsWithSuggested}) =>
  <Card>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        With Suggested Topic
      </Typography>
      <Typography component="p">
        {numberOfPostsWithSuggested} posts have suggested topic.
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color="primary" action={handleShowButtonClick}>
        Show
      </Button>
    </CardActions>
  </Card>;

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
