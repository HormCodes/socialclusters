import {Card} from "@material-ui/core";
import React from "react";
import * as PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({});

const WithoutTopicCard = ({handleShowButtonClick, numberOfWithoutTopic}) =>
  <Card>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        Without Topic
      </Typography>
      <Typography component="p">
        {numberOfWithoutTopic} posts haven't topic.
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color="primary" action={handleShowButtonClick}>
        Show
      </Button>
    </CardActions>
  </Card>;

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
