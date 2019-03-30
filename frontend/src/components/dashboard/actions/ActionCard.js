import {Card} from "@material-ui/core";
import React from "react";
import * as PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({});

const ActionCard = ({
                      handleButtonClick,
                      title,
                      text,
                      buttonTitle,
                    }) =>
  <Card>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Typography component="p">
        {text}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" color="primary" onClick={handleButtonClick}>
        {buttonTitle}
      </Button>
    </CardActions>
  </Card>;

ActionCard.propTypes = {
  handleButtonClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
};

ActionCard.defaultProps = {
  handleButtonClick: () => {
  },
  title: "",
  text: "",
  buttonTitle: "",
};

export default withStyles(styles)(ActionCard)
